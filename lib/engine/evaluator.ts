type Token = { type: 'num'; value: number } | { type: 'op'; value: string };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch >= '0' && ch <= '9') {
      let num = '';
      while (i < expr.length && expr[i] >= '0' && expr[i] <= '9') {
        num += expr[i++];
      }
      tokens.push({ type: 'num', value: Number(num) });
    } else if ('+-*/'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
    } else {
      throw new Error(`Unexpected character: ${ch}`);
    }
  }
  return tokens;
}

// Evaluate tokens respecting * / before + -
export function evaluate(expr: string): number {
  if (!expr || expr.trim() === '') throw new Error('Empty expression');
  const tokens = tokenize(expr);
  if (tokens.length === 0) throw new Error('No tokens');

  // First pass: handle * and /
  const reduced: Token[] = [];
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.type === 'op' && (tok.value === '*' || tok.value === '/')) {
      const left = reduced.pop();
      const right = tokens[i + 1];
      if (!left || left.type !== 'num' || !right || right.type !== 'num') {
        throw new Error('Invalid expression');
      }
      if (tok.value === '/' && right.value === 0) throw new Error('Division by zero');
      const result = tok.value === '*' ? left.value * right.value : left.value / right.value;
      reduced.push({ type: 'num', value: result });
      i += 2;
    } else {
      reduced.push(tok);
      i++;
    }
  }

  // Second pass: handle + and -
  let result = (reduced[0] as { type: 'num'; value: number }).value;
  for (let j = 1; j < reduced.length; j += 2) {
    const op = reduced[j] as { type: 'op'; value: string };
    const right = reduced[j + 1] as { type: 'num'; value: number };
    if (!op || !right) throw new Error('Invalid expression');
    if (op.value === '+') result += right.value;
    else if (op.value === '-') result -= right.value;
    else throw new Error(`Unexpected op: ${op.value}`);
  }

  return result;
}
