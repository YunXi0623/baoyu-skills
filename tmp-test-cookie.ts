import { readFileSync } from 'fs';
import { join } from 'path';

const cookiePath = join(process.env.APPDATA!, 'baoyu-skills', 'gemini-web', 'cookies.json');
const c = JSON.parse(readFileSync(cookiePath, 'utf8'));
const m: Record<string, string> = c.cookieMap;
const cookieStr = Object.entries(m).map(([k, v]) => `${k}=${v}`).join('; ');

const res = await fetch('https://gemini.google.com/app', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    Cookie: cookieStr,
  },
  redirect: 'follow',
});

console.log('status:', res.status);
const text = await res.text();
console.log('has SNlM0e:', /SNlM0e/.test(text));
console.log('length:', text.length);
// Check what we got
const titleMatch = text.match(/<title>(.*?)<\/title>/);
console.log('title:', titleMatch?.[1] || 'no title');
// Check for consent/redirect indicators
console.log('has consent:', /consent/.test(text));
console.log('has signin:', /signin/.test(text));
console.log('has accounts.google:', /accounts\.google/.test(text));
console.log('has WIZ_global_data:', /WIZ_global_data/.test(text));
// Save first 2000 chars for inspection
require('fs').writeFileSync('tmp-response.txt', text.slice(0, 3000));
// Search for FdrFJe with context
const fdrIdx = text.indexOf('FdrFJe');
if (fdrIdx >= 0) {
  console.log('FdrFJe context:', JSON.stringify(text.slice(fdrIdx - 5, fdrIdx + 80)));
}
// Search for at_token pattern (the new approach)
const atMatch = text.match(/\"at\":\"([^\"]+)\"/);
console.log('has "at" token:', !!atMatch, atMatch?.[1]?.slice(0, 30));
// Search for bl token
const blMatch = text.match(/\"bl\":\"([^\"]+)\"/);
console.log('has "bl" token:', !!blMatch, blMatch?.[1]?.slice(0, 30));
// Check SNlM0e alternatives
for (const name of ['SNlM0e', 'FdrFJe', 'cfb2h', 'WIZ_global_data']) {
  const idx = text.indexOf(name);
  if (idx >= 0) console.log(`${name} at ${idx}:`, JSON.stringify(text.slice(idx, idx + 100)));
}
