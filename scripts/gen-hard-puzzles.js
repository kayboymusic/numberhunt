const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'puzzles.json');
const puzzles = JSON.parse(fs.readFileSync(file, 'utf8'));

function evalMini(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (/\d/.test(c)) {
      let j = i;
      while (j < expr.length && /\d/.test(expr[j])) j++;
      tokens.push({ t: 'n', v: parseInt(expr.slice(i, j), 10) });
      i = j;
    } else if ('+-*/'.includes(c)) {
      tokens.push({ t: 'o', v: c });
      i++;
    } else return null;
  }
  if (tokens.length === 0) return null;
  const stack = [tokens[0]];
  for (let k = 1; k < tokens.length; k += 2) {
    const op = tokens[k];
    const right = tokens[k + 1];
    if (!op || !right) return null;
    if (op.v === '*') {
      const left = stack.pop();
      stack.push({ t: 'n', v: left.v * right.v });
    } else if (op.v === '/') {
      const left = stack.pop();
      if (right.v === 0) return null;
      const v = left.v / right.v;
      if (!Number.isInteger(v)) return null;
      stack.push({ t: 'n', v });
    } else {
      stack.push(op, right);
    }
  }
  let result = stack[0].v;
  for (let k = 1; k < stack.length; k += 2) {
    const op = stack[k].v;
    const right = stack[k + 1].v;
    if (op === '+') result += right;
    else result -= right;
  }
  return result;
}

function hasLeadingZero(s) {
  return /(?<![0-9])0[0-9]/.test(s);
}

function isValid(eq) {
  if (eq.length !== 10) return false;
  if (!/^[0-9+\-*/=]+$/.test(eq)) return false;
  const parts = eq.split('=');
  if (parts.length !== 2) return false;
  const [lhs, rhs] = parts;
  if (!lhs || !rhs) return false;
  if (hasLeadingZero(lhs) || hasLeadingZero(rhs)) return false;
  const l = evalMini(lhs);
  const r = evalMini(rhs);
  if (l === null || r === null) return false;
  return Math.abs(l - r) < 1e-9;
}

const buckets = { mul: [], addBig: [], subBig: [], mixed: [], sumQuad: [] };

for (let a = 10; a <= 99; a++) {
  for (let b = 10; b <= 99; b++) {
    const r = a * b;
    if (r >= 1000 && r <= 9999) {
      const eq = `${a}*${b}=${r}`;
      if (isValid(eq)) buckets.mul.push(eq);
    }
  }
}
for (let a = 100; a <= 999; a++) {
  for (let b = 10; b <= 99; b++) {
    const r = a + b;
    if (r >= 100 && r <= 999) {
      const eq = `${a}+${b}=${r}`;
      if (isValid(eq)) buckets.addBig.push(eq);
    }
  }
}
for (let a = 100; a <= 999; a++) {
  for (let b = 10; b <= 99; b++) {
    const r = a - b;
    if (r >= 100 && r <= 999) {
      const eq = `${a}-${b}=${r}`;
      if (isValid(eq)) buckets.subBig.push(eq);
    }
  }
}
for (let a = 10; a <= 99; a++) {
  for (let b = 1; b <= 9; b++) {
    for (let c = 1; c <= 9; c++) {
      const r = a * b + c;
      if (r >= 100 && r <= 999) {
        const eq = `${a}*${b}+${c}=${r}`;
        if (isValid(eq)) buckets.mixed.push(eq);
      }
    }
  }
}
for (let a = 1; a <= 9; a++) {
  for (let b = 1; b <= 9; b++) {
    for (let c = 1; c <= 9; c++) {
      for (let d = 1; d <= 9; d++) {
        const r = a + b + c + d;
        if (r >= 10 && r <= 36) {
          const eq = `${a}+${b}+${c}+${d}=${r}`;
          if (isValid(eq)) buckets.sumQuad.push(eq);
        }
      }
    }
  }
}

function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}
const rand = rng(42);
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
for (const k of Object.keys(buckets)) shuffle(buckets[k]);

const dates = Object.keys(puzzles).sort();
console.error('dates:', dates.length);
console.error(
  'bucket sizes:',
  Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length]))
);

const order = ['mul', 'addBig', 'subBig', 'mixed', 'sumQuad'];
const seen = new Set();
let oi = 0;
for (const date of dates) {
  let picked = null;
  for (let tries = 0; tries < order.length; tries++) {
    const bucket = buckets[order[(oi + tries) % order.length]];
    while (bucket.length) {
      const cand = bucket.pop();
      if (!seen.has(cand)) {
        picked = cand;
        break;
      }
    }
    if (picked) {
      oi = (oi + tries + 1) % order.length;
      break;
    }
  }
  if (!picked) throw new Error('out of equations for ' + date);
  seen.add(picked);
  if (!isValid(picked)) throw new Error('bad: ' + picked);
  puzzles[date].hard = { solution: picked };
}

fs.writeFileSync(file, JSON.stringify(puzzles, null, 2) + '\n');
console.error('wrote', dates.length, 'hard puzzles');
console.error(
  'first 5:\n  ' + dates.slice(0, 5).map((d) => `${d}: ${puzzles[d].hard.solution}`).join('\n  ')
);
