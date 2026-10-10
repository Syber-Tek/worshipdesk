const { packager } = require('@electron/packager');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('exit', (code) => {
  console.log('PROCESS EXIT EVENT with code:', code);
});

async function test() {
  console.log('Starting packager test with process hooks...');
  try {
    const appPaths = await packager({
      dir: __dirname,
      name: 'WordDesk',
      executableName: 'WordDesk',
      platform: 'win32',
      arch: 'x64',
      out: path.join(__dirname, 'out'),
      overwrite: true,
      asar: false,
      electronVersion: '44.4.1',
      icon: path.join(__dirname, 'src', 'assets', 'app-icon-dark.ico'),
      quiet: false,
    });
    console.log('Packaging succeeded! Output paths:', appPaths);
  } catch (err) {
    console.error('Packaging failed with error:', err);
  }
}

test();
