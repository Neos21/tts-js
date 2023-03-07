const childProcess = require('node:child_process');

function darwin(text) {
  childProcess.spawn('say', [text]);
}

function win32(text) {
  const child = childProcess.spawn('chcp 65001 > NUL & powershell.exe -NonInteractive -NoProfile -Command',
    ['Add-Type -AssemblyName System.speech; $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.Speak([Console]::In.ReadToEnd()); $speak.Dispose();'],
    { shell: true }
  );
  child.stdin.end(text);
}

(() => {
  const text = process.argv.slice(2).join(' ').trim();
  if(text === '') return;
  
  const platform = process.platform;
  if(platform === 'darwin') return darwin(text);
  if(platform === 'win32' ) return win32(text);
  throw new Error('Unsupported Platform');
})();
