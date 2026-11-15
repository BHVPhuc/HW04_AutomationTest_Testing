const { spawnSync } = require('child_process');

const features = ['FR-06', 'FR-08', 'FR-15'];
const browsers = ['chromium', 'firefox', 'webkit'];

for (const f of features) {
  for (const b of browsers) {
    console.log(`\n=== Running ${f} on ${b} ===`);
    spawnSync('npx', ['playwright', 'test', `tests/${f}.spec.js`, `--project=${b}`], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, FEATURE: f, BROWSER: b },
    });
  }
}
