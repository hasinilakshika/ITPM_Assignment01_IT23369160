

const { test, expect } = require('@playwright/test');
const path = require('path');


test.setTimeout(120000);

// Joining the test data 
const testData = require(path.join(__dirname, '..', 'testData.json'));

test.describe('Test Case', () => {

    // Creates a new test block for every item in Jason file
    for (const data of testData) {
        
        test(`${data.id}: ${data.input.substring(0, 20)}...`, async ({ page }) => {
            //Timeout for each test case
            test.setTimeout(30000); 

            await page.goto('https://www.swifttranslator.com/',{
                waitUntil: 'domcontentloaded',
                timeout: 60000
             } );

            const inputBox = page.locator('textarea').first();
            const outputBox = page.locator('div.bg-slate-50.whitespace-pre-wrap').first();

            //Inputting test case
            await inputBox.fill(data.input);

            // Automated Validation
            if (data.expected) {
                
                await expect(outputBox).toContainText(data.expected.trim(), { timeout: 20000 });
            }
            
            const actualResult = await outputBox.innerText();
      console.log(`ID: ${data.id}`);
      console.log(`EXPECTED: ${data.expected}`);
      console.log(`ACTUAL  : ${actualResult}`);
      console.log('-------------------------');
    });
  }

    // UI Test Case 
    test('Pos_UI_0001 - Verify Clear button resets the interface', async ({ page }) => {
        await page.goto('https://www.swifttranslator.com/');
        const inputBox = page.locator('textarea').first();
        const outputBox = page.locator('div.bg-slate-50.whitespace-pre-wrap').first();
        
        await inputBox.fill('Testing clear button');
        await expect(outputBox).not.toBeEmpty();
        
        const clearButton = page.getByLabel('Clear'); 
        await clearButton.click();
        
        await expect(inputBox).toBeEmpty();
        await expect(outputBox).toBeEmpty();
    });
});


