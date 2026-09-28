// Guards the one class of refactor bug a green build cannot catch: a handler
// referenced from JSX or called, but no longer defined anywhere in the file.
// Vite/esbuild treat an unresolved identifier as a global, so `npm run build`
// passes and the app dies at runtime with "x is not defined".
//
// This exists because a 600-line cut out of App.jsx silently took nine
// handlers with it and the build stayed green the whole time.
//
// Run: node test/undefined-refs.mjs <file...>

import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node test/undefined-refs.mjs <file...>");
  process.exit(2);
}

// Language keywords and globals are never expected to be bound in the file.
const GLOBALS = new Set([
  "if", "for", "while", "switch", "catch", "return", "typeof", "await",
  "async", "function", "new", "delete", "void", "in", "of", "do", "else",
  "try", "finally", "throw", "case", "break", "continue", "default", "yield",
  "window", "document", "console", "Math", "JSON", "Object", "Array", "String",
  "Number", "Boolean", "Date", "Set", "Map", "WeakMap", "Promise", "Error",
  "RegExp", "Symbol", "parseInt", "parseFloat", "isNaN", "setTimeout",
  "clearTimeout", "setInterval", "clearInterval", "fetch", "alert", "confirm",
  "process", "Buffer", "URL", "URLSearchParams", "Blob", "File", "FileReader",
  "AbortController", "React", "localStorage", "navigator", "location", "NaN",
  "Infinity", "undefined", "true", "false", "null", "require", "module",
]);

// Remove comments, strings and template literals so their contents are never
// mistaken for code references. JSX text nodes survive this, so the caller
// position filter below is what keeps false positives out.
const strip = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ")
    .replace(/`(?:[^`\\]|\\.)*`/g, " ")
    .replace(/"(?:[^"\\]|\\.)*"/g, " ")
    .replace(/'(?:[^'\\]|\\.)*'/g, " ");

let failures = 0;

for (const file of files) {
  const code = strip(readFileSync(file, "utf8"));

  const bound = new Set();
  const bind = (text) => {
    for (const m of String(text).matchAll(/[A-Za-z_$][\w$]*/g)) bound.add(m[0]);
  };

  // Declarations, including array/object destructuring, which is where most
  // bindings in this codebase actually live.
  for (const m of code.matchAll(
    /\b(?:const|let|var)\s+(\{[^}]*\}|\[[^\]]*\]|[A-Za-z_$][\w$]*)/g
  )) {
    bind(m[1]);
  }
  for (const m of code.matchAll(/function\s*\*?\s*([A-Za-z_$][\w$]*)/g)) bound.add(m[1]);
  for (const m of code.matchAll(/class\s+([A-Za-z_$][\w$]*)/g)) bound.add(m[1]);

  // Named imports, including `as` aliases.
  for (const m of code.matchAll(/import\s+\{([^}]*)\}\s+from/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop();
      if (name) bound.add(name.trim());
    }
  }
  // Default and namespace imports: `import Foo from`, `import * as Foo from`.
  for (const m of code.matchAll(/import\s+([A-Za-z_$][\w$]*)\s*(?:,|from)/g)) {
    bound.add(m[1]);
  }
  for (const m of code.matchAll(/import\s+\*\s+as\s+([A-Za-z_$][\w$]*)/g)) {
    bound.add(m[1]);
  }
  // Shorthand object properties: the hook destructure pattern, one per line.
  // Deliberately NOT `[{,]\s*name\s*[,}]`, which also matches the `{...}` of a
  // JSX prop expression and would mark every `onClick={handler}` as defined —
  // hiding exactly the bug this file exists to catch.
  for (const m of code.matchAll(/^\s+([A-Za-z_$][\w$]*)\s*,?\s*$/gm)) bound.add(m[1]);
  // Function parameters and arrow arguments.
  for (const m of code.matchAll(/\(([^)]*)\)\s*(?:=>|\{)/g)) bind(m[1]);
  for (const m of code.matchAll(/(?<![\w.$])([A-Za-z_$][\w$]*)\s*=>/g)) bound.add(m[1]);
  for (const m of code.matchAll(/catch\s*\(\s*([A-Za-z_$][\w$]*)/g)) bound.add(m[1]);
  // Object literal keys, so `onClick: handleFoo` style does not self-report.
  for (const m of code.matchAll(/([A-Za-z_$][\w$]*)\s*:/g)) bound.add(m[1]);
  // Property accesses are not free references.
  for (const m of code.matchAll(/\.([A-Za-z_$][\w$]*)/g)) bound.add(m[1]);

  // The two positions where a deleted handler actually breaks: a JSX prop value
  // and a call expression.
  const referenced = new Set();
  for (const m of code.matchAll(/=\{([A-Za-z_$][\w$]*)\}/g)) referenced.add(m[1]);
  for (const m of code.matchAll(/(?<![\w.$])([A-Za-z_$][\w$]*)\s*\(/g)) {
    referenced.add(m[1]);
  }

  const missing = [...referenced]
    .filter((n) => !bound.has(n))
    .filter((n) => !GLOBALS.has(n))
    // `new Foo(`, `typeof x`, JSX tags and JSX text nodes are not free refs.
    .filter((n) => !new RegExp(`(?:new|typeof|await|return|=>|&&|\\|\\|)\\s*${n}\\b`).test(code))
    .filter((n) => !new RegExp(`<${n}[\\s/>]`).test(code))
    // A hook is always imported, and a name this shape is never a deleted
    // local handler, so it only adds noise here.
    .filter((n) => !/^use[A-Z]/.test(n))
    // Keep the signal readable: only handler/value shaped names.
    .filter((n) => /^(handle|set|on|get|is|has|toggle|select|update|remove|add|delete|move|stage|broadcast|play|stop)/i.test(n) || /^[a-z][\w]*[A-Z]/.test(n))
    .sort();

  if (missing.length > 0) {
    failures += missing.length;
    console.log(`${file}: UNDEFINED -> ${missing.join(", ")}`);
  } else {
    console.log(`${file}: ok`);
  }
}

if (failures > 0) {
  console.error(`\nFAILED: ${failures} undefined reference(s)`);
  process.exit(1);
}
console.log("\nall references resolve");
