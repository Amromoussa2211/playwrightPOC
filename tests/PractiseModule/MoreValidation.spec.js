const { test,expect } = require("@playwright/test")



test("More validation",async ({page})=>{

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // await page.goto("https://www.google.com/");
    // await page.goBack();
    // await page.goForward();

     expect(await page.locator("#displayed-text")).toBeVisible();
     await page.locator("[value='Hide']").click();
     expect(await page.locator("#displayed-text")).toBeHidden();
    
     // await page.pause();
      page.on('dialog',dialog=>dialog.accept());
      await page.locator("#confirmbtn").click();


      await page.locator("#mousehover").hover();


     const framePage = await page.frameLocator("#courses-iframe");
     await framePage.locator("li a[href='lifetime-access']:visible").click();
     const textcheck = await framePage.locator(".text h2").textContent();
     console.log(textcheck.split(" ")[1]);


})