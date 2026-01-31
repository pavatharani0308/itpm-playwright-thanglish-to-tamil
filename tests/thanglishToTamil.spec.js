const { test, expect } = require('@playwright/test');

/**
 * Helper: get Tamil output from the 2nd textarea (target area)
 */
async function getOutputText(page) {
  await page.waitForSelector('textarea');
  await page.waitForFunction(() => {
    return document.querySelectorAll('textarea').length >= 2;
  });

  return await page.locator('textarea').nth(1).inputValue();
}

/**
 * Helper: translate given input using the site
 * NOTE: site updates as you type / on Enter in many cases
 */
async function translate(page, input) {
  await page.goto('https://tamil.changathi.com/');
  await page.fill('textarea', input);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);
  return await getOutputText(page);
}

/**
 * Helper: Basic check if output contains Tamil letters
 */
function hasTamilLetters(text) {
  return /[அ-ஹ]/.test(text);
}

/* =========================
   ✅ 25 POSITIVE SCENARIOS
   ========================= */

test('Pos 01 - Polite daily greeting', async ({ page }) => {
  const output = await translate(page, 'kaalai vanakkam amma');
  expect(output).toContain('காலை வணக்கம் அம்மா');
});

test('Pos 02 - Short polite request', async ({ page }) => {
  const output = await translate(page, 'konjam water kudunga');
  expect(output).toContain('கொஞ்சம்');
});

test('Pos 03 - Interrogative daily question', async ({ page }) => {
  const output = await translate(page, 'sapadu saaptiya?');
  expect(output).toContain('சாப்பாடு');
});

test('Pos 04 - Negative statement', async ({ page }) => {
  const output = await translate(page, 'naan varala');
  expect(output).toContain('நான் வரல');
});

test('Pos 05 - Past tense sentence', async ({ page }) => {
  const output = await translate(page, 'naan netru exam ezhudhinen');
  expect(output).toContain('நான் நேற்று exam எழுதினேன்');
});

test('Pos 06 - Future plan', async ({ page }) => {
  const output = await translate(page, 'naalai naan library-ku poguven');
  expect(output).toContain('நாளை');
});

test('Pos 07 - Compound cause/effect', async ({ page }) => {
  const output = await translate(page, 'mazhai peyyuthu, athunaala veetula irukken');
  expect(output).toContain('மழை');
});

test('Pos 08 - Mixed Thanglish + English', async ({ page }) => {
  const output = await translate(page, 'innaiku office meeting cancel aayiduchu');
  expect(output).toContain('இன்னைக்கு');
});

test('Pos 09 - Repeated words emphasis', async ({ page }) => {
  const output = await translate(page, 'seekiram seekiram vaa');
  expect(output).toContain('சீக்கிரம் சீக்கிரம் வா');
});

test('Pos 10 - Currency usage', async ({ page }) => {
  const output = await translate(page, 'indha book price Rs. 1200');
  expect(output).toContain('Rs.');
});

test('Pos 11 - Pronoun usage', async ({ page }) => {
  const output = await translate(page, 'naanga unakku support pannuvom');
  expect(output).toContain('நாங்க');
});

test('Pos 12 - Singular/plural + negation', async ({ page }) => {
  const output = await translate(page, 'oru ticket pothum, rendu tickets vendam');
  expect(output).toContain('வேண்டாம்');
});

test('Pos 13 - Time format sentence', async ({ page }) => {
  const output = await translate(page, 'meeting morning 9:30-ku start aagum');
  expect(output).toContain('9:30');
});

test('Pos 14 - Date mention', async ({ page }) => {
  const output = await translate(page, 'exam 2026-03-15 anikku nadakkum');
  expect(output).toContain('2026-03-15');
});

test('Pos 15 - Punctuation handling', async ({ page }) => {
  const output = await translate(page, 'enna idhu?! ipdi pannina epdi?');
  expect(output).toContain('?!');
});

test('Pos 16 - Slang informal sentence', async ({ page }) => {
  const output = await translate(page, 'dei romba bore adikkuthu');
  expect(output).toContain('டேய்');
});

test('Pos 17 - Units of measurement', async ({ page }) => {
  const output = await translate(page, '2kg arisi vaangi vaa');
  expect(output).toContain('2kg');
});

test('Pos 18 - Joined word (busstopla)', async ({ page }) => {
  const output = await translate(page, 'busstopla romba koottam');
  // output may be "bus stop-ல" or keep "busstop" - accept either
  expect(output.toLowerCase().includes('bus')).toBeTruthy();
});

test('Pos 19 - Extra spaces robustness', async ({ page }) => {
  const output = await translate(page, 'naan   konjam   busy');
  expect(output).toContain('நான்');
});

test('Pos 20 - Line break input', async ({ page }) => {
  const output = await translate(page, 'amma\nnaan late-aa varuven');
  expect(output).toContain('அம்மா');
});

test('Pos 21 - Longer paragraph (multi-sentence)', async ({ page }) => {
  const output = await translate(
    page,
    'innaiku morning semma vela irundhuchu. bus miss aayiduchu. office-ku late-aa poiten. evening thirumbi veetukku vandhen.'
  );
  expect(output).toContain('இன்னைக்கு');
});

test('Pos 22 - Polite formal request', async ({ page }) => {
  const output = await translate(page, 'ungalukku time irundhaal help pannunga');
  expect(output).toContain('உங்களுக்கு');
});

test('Pos 23 - Brand term embedded', async ({ page }) => {
  const output = await translate(page, 'naan Samsung phone vaanginen');
  expect(output).toContain('Samsung');
});

test('Pos 24 - Negative question', async ({ page }) => {
  const output = await translate(page, 'nee varalaya?');
  expect(output).toContain('வரல');
});

test('Pos 25 - UI clear and retype updates output', async ({ page }) => {
  await page.goto('https://tamil.changathi.com/');

  await page.fill('textarea', 'vanakkam');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  const first = await getOutputText(page);
  expect(first).toContain('வணக்கம்');

  // clear and retype
  await page.fill('textarea', '');
  await page.fill('textarea', 'nandri');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  const second = await getOutputText(page);
  expect(second).toContain('நன்றி');
});

/* =========================
   ❌ 15 NEGATIVE SCENARIOS
   =========================
   NOTE: For negative cases, we check that output is empty OR
   not meaningfully converted (no Tamil letters / unchanged / contains junk).
*/

test('Neg 01 - Empty input', async ({ page }) => {
  const output = await translate(page, '');
  expect(output.length).toBe(0);
});

test('Neg 02 - Only symbols', async ({ page }) => {
  const output = await translate(page, '###$$$');
  expect(output.length === 0 || output.includes('#') || output.includes('$')).toBeTruthy();
});

test('Neg 03 - Emojis with text', async ({ page }) => {
  const output = await translate(page, 'naan happy 😄😄');
  expect(output.includes('😄') || output.toLowerCase().includes('happy') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 04 - Pure English sentence', async ({ page }) => {
  const output = await translate(page, 'Please complete the task today');
  expect(output.toLowerCase().includes('please') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 05 - Heavy spelling mistakes', async ({ page }) => {
  const output = await translate(page, 'naaaaan vvvvvaarrrren');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 06 - Chat abbreviations only', async ({ page }) => {
  const output = await translate(page, 'lol brb ttyl');
  expect(output.toLowerCase().includes('lol') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 07 - Mixed foreign words (not Tamil phonetics)', async ({ page }) => {
  const output = await translate(page, 'naan hari lassan venum');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 08 - Excessive emojis', async ({ page }) => {
  const output = await translate(page, 'super 😄😄😄😄');
  expect(output.includes('😄') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 09 - Random characters', async ({ page }) => {
  const output = await translate(page, 'asdfghjkl');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 10 - Numerics noise with text', async ({ page }) => {
  const output = await translate(page, '1234 naan pogiren');
  expect(output.includes('1234') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 11 - Unsupported symbols with text', async ({ page }) => {
  const output = await translate(page, 'naan @ home #now');
  expect(output.includes('@') || output.includes('#') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 12 - Weird casing noise', async ({ page }) => {
  const output = await translate(page, 'NaAn InNaIkU vArAlA');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 13 - Copy-paste junk words', async ({ page }) => {
  const output = await translate(page, 'lorem ipsum dolor sit amet naan pogiren');
  expect(output.toLowerCase().includes('lorem') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 14 - Mixed unsupported script', async ({ page }) => {
  const output = await translate(page, 'naan 你好 varuven');
  expect(output.includes('你好') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 15 - Long gibberish', async ({ page }) => {
  const output = await translate(page, 'qwertyuiopasdfghjklzxcvbnm qwertyuiopasdfghjklzxcvbnm qwertyuiopasdfghjklzxcvbnm');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});
