const {test, expect} =require('@playwright/test')


test("Screenshot & visual ", async ({page})=>
{
         await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
         await expect(page.locator("#displayed-text")).toBeVisible();
         await page.locator("#displayed-text").screenshot({path:'partialScreenshot.png'})
         await page.locator("[value='Hide']").click();
         await page.screenshot({path:'screeeshot.png'});
         expect(await page.locator("#displayed-text")).toBeHidden();
})



test('visual Testing', async ({page})=>{

  await page.goto("https://www.flightaware.com/");
  expect(await page.screenshot()).toMatchSnapshot('landing.png');



})