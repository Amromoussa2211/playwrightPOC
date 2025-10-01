const {test, expect} =require('@playwright/test');
const { ADDRGETNETWORKPARAMS, promises } = require('dns');


test("Login test case", async ({page})=>
{
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        await page.locator('input#username').fill("rahulshettyacademy1");
        await page.locator('[name="password"]').fill("learning");
        const drop1 = page.locator("select.form-control");
        await drop1.selectOption("consult");
        await page.locator(".radiotextsty").last().click();
        await page.locator("#okayBtn").click();
        await expect(page.locator(".radiotextsty").last()).toBeChecked();


        await page.locator("#terms").click();
        await expect(page.locator("#terms")).toBeChecked();


        await page.locator("#terms").uncheck();
        expect(await page.locator("#terms").isChecked()).toBeFalsy();


        await expect(page.locator("[href*='documents-request']")).toHaveAttribute("class","blinkingText");

    })


test('UI child Test Case',async({browser})=>
{

        const context = await browser.newContext(); 
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const hoverlink = page.locator("[href*='documents-request']");

       const [newPage]=await Promise.all([

        context.waitForEvent('page'),
        hoverlink.click(),
      ])

    const text = await newPage.locator(".red").textContent();
    const arrayText= text.split("@")
    const emailText= arrayText[1].split(" ")[0]
    //console.log(emailText);

    await page.locator("#username").fill(emailText);
    await page.pause();
    console.log(await page.locator("#username").textContent());



    })