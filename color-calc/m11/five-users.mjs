// Share of problems found by n users in Nielsen and Landauer's model: 1 - (1 - L)^n, with L = 0.31 (NN/g, 2000).
// Run: node five-users.mjs > five-users-output.txt
import assert from 'node:assert';
const L = 0.31;
const found = (n) => 1 - (1 - L) ** n;
assert(Math.abs(found(5) - 0.8436) < 1e-4); // the research notes' hand check: 1 - 0.69^5 = 0.8436
for (let n = 1; n <= 20; n++) console.log(String(n).padStart(2), (found(n) * 100).toFixed(1) + '%');
