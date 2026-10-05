// Structural guard for the Repair / Update / Uninstall prompt in
// build/installer.nsh.
//   node test/installer-branches.mjs
//
// Why a source check rather than a behavioural one: the only way to run NSIS
// branches is to compile and execute an installer-shaped exe, and Windows blocks
// a freshly built unsigned one ("Access is denied"), so that harness cannot run
// here. `npm run make` compiles the real macro on every build, which covers the
// syntax; this covers the wiring, which is the part a future edit can quietly
// break.
//
// The property that matters: all three answers are accounted for explicitly, and
// none of them can fall through into the install. MessageBox takes at most two
// return-check pairs, so a third outcome left to "fall through to whatever comes
// next" is one deleted line away from silently reinstalling over the top while
// the operator believes they cancelled.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const file = path.join(import.meta.dirname, '..', 'build', 'installer.nsh');
const src = fs.readFileSync(file, 'utf-8');

// ─── the question ─────────────────────────────────────────────────────────────

// Only one return-check pair, and it is for the default. Everything else is
// decided by the button value in $0.
const question = src.match(
  /MessageBox MB_YESNOCANCEL[\s\S]*?\/SD (\w+) (?:(\w+) (\w+))?/,
);
assert.ok(question, 'the Repair/Update/Uninstall question is missing');
const [, silentDefault, jumpedButton, jumpedLabel] = question;
assert.equal(
  silentDefault,
  'IDYES',
  'the silent default must be the repair branch, or an unattended auto-update stalls on a question nobody can answer',
);
assert.ok(jumpedButton, 'the question registers no return-check pair');
assert.equal(jumpedButton, 'IDYES', 'Yes must be the branch reached by MessageBox itself');

// Only Uninstall branches on the button value. Everything else is the fall-through,
// which is what makes the Cancel path depend on the quit directly after it.
assert.equal(
  [...src.matchAll(/\$\{If\} \$0 == "(\w+)"/g)].map((m) => m[1]).join(','),
  'IDNO',
  'the only branch on the button value should be No',
);
assert.equal(
  [...src.matchAll(/\$\{ElseIf\} \$0 ==/g)].length,
  0,
  'a ${ElseIf} on the button value would reintroduce an outcome that depends on ordering',
);

// ─── the three outcomes ───────────────────────────────────────────────────────

// Everything between the question and the repair label is the No and Cancel
// paths, in that order. The Uninstall branch holds a nested ${EndIf} for its
// failure report, so it ends at the LAST one, not the first.
const fallthrough = src.slice(src.indexOf('/SD IDYES'), src.indexOf('wd_choice_repair:'));
const noStart = fallthrough.indexOf('${If} $0 == "IDNO"');
const noEnd = fallthrough.lastIndexOf('${EndIf}');
assert.ok(noStart > 0 && noEnd > noStart, 'the Uninstall branch is missing');
const noBranch = fallthrough.slice(noStart, noEnd);
assert.match(
  noBranch,
  /CopyFiles \/SILENT "\$R0" "\$PLUGINSDIR\\wd-old-uninstaller\.exe"/,
  'the old uninstaller must be copied out of the folder it is about to run from',
);
assert.match(
  noBranch,
  /ExecWait '"\$\{?PLUGINSDIR\}?\\wd-old-uninstaller\.exe" \/S _\?=\$R1'/,
  'the uninstall branch must actually run the old uninstaller',
);
assert.match(noBranch, /could not be uninstalled/, 'a failed uninstall must be reported');
assert.match(noBranch, /\n\s*Quit\s*$/, 'the Uninstall branch must end in Quit');

// Cancel: whatever is left after the Uninstall ${EndIf} up to the repair label.
// Comments aside, it must be nothing but SetErrorLevel and Quit. Any other
// statement here is how "Cancel" would turn into "install anyway".
const cancelBranch = fallthrough
  .slice(noEnd + '${EndIf}'.length)
  .split('\n')
  .filter((line) => !line.trim().startsWith(';'))
  .join('\n');
assert.match(
  cancelBranch,
  /^\s*SetErrorLevel 0\s*\r?\n\s*Quit\s*$/,
  'Cancel must be nothing but SetErrorLevel + Quit, with no other statement in between',
);

// ─── the repair and fresh paths ───────────────────────────────────────────────

const repair = src.slice(src.indexOf('wd_choice_repair:'), src.indexOf('wd_install_fresh:'));
assert.match(repair, /SetOverwrite on/, 'a repair must overwrite, or it cannot restore deleted files');
assert.match(repair, /SetOutPath "\$R1"/, 'a repair must continue in the folder already installed');
assert.match(repair, /StrCpy \$INSTDIR "\$R1"/, 'a repair must keep the existing install location');
assert.match(repair, /Return\s*$/, 'a repair must return so the install continues');

const fresh = src.slice(src.indexOf('wd_install_fresh:'));
assert.match(fresh, /SetOverwrite off/, 'a fresh install must not overwrite');

// ─── reaching the question at all ─────────────────────────────────────────────

// The question is only asked when there is a real installation: an uninstaller
// entry plus an InstallLocation that still contains the executable. Without the
// executable check a stale entry would send a first-time user down the Uninstall
// path.
assert.match(src, /IfFileExists "\$R1\\\$\{APP_EXECUTABLE_FILENAME\}" 0 wd_install_fresh/);
assert.equal(
  [...src.matchAll(/Goto wd_install_fresh/g)].length,
  2,
  'both empty registry reads must skip the question (the third skip is the IfFileExists above)',
);

console.log('installer-branches: all assertions passed');