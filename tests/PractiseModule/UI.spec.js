const {test, expect} =require('@playwright/test')


test.describe.configure({mode:'serial'});
test("@web browser test case", async ({browser})=>
{
        const context = await browser.newContext(); 
        const page = await context.newPage();
        await page.goto("https://www.google.com/");
        await expect(page).toHaveTitle("Google");
});


test("Login test case", async ({page})=>
{
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        await page.locator('input#username').fill("rahulshettyacademy1");
        await page.locator('[type="password"]').fill("learning");
        await page.locator("#signInBtn").click();
        await page.locator("[style*=block]").textContent();
        console.log(await page.locator("[style*=block]").textContent())
        await expect(await page.locator("[style*=block]")).toContainText("Incorrect username/password.");



          //enter valid data
        const alltitles = page.locator(".card-body a");
        await page.locator('input#username').fill("");
        await page.locator('[type="password"]').fill("");
        await page.locator('input#username').fill("rahulshettyacademy");
        await page.locator('[type="password"]').fill("learning");
        await page.locator("#signInBtn").click();
        console.log(await alltitles.first().textContent());
        console.log(await alltitles.allTextContents());
        
    


});  