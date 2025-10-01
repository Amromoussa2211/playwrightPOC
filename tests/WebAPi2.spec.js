const { test, expect } = require('@playwright/test');
 
 

let webContext;

test.beforeAll(async({browser})=>{

            const context = await browser.newContext();
            const page = await context.newPage();
            // Login page go to URL 
            await page.goto("https://rahulshettyacademy.com/client");
            // fill email
            await page.locator("#userEmail").fill("anshika@gmail.com");
            // Lfill password
            await page.locator("#userPassword").fill("Iamking@000");
            // click on login 
            await page.locator("[value='Login']").click();
            // wait for page load
            await page.waitForLoadState('networkidle');
             
            await context.storageState({path: 'state.json'});

            webContext = await browser.newContext({storageState : 'state.json'});
})


test.only('Web Client App login', async () => {
   
   const page = await webContext.newPage();
   await page.goto("https://rahulshettyacademy.com/client");


   const email ="";
   const productName="ZARA COAT 3";
   const products = page.locator(".card-body");
     // retutn  product name based on CSSselector travser .className child 
   // first() return first item 
   // allTextContents  return array for all textcontents()

   const titles =await page.locator(".card-body b").first().allTextContents();
   console.log(titles)

   //return numbers of products and assign to count
   const count= await products.count();
   for(let i=0 ; i<count;i++)
      {
         //loop on products and loctor again "b"
      if (await products.nth(i).locator("b").textContent() == productName)
         {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
         }
   }
    //await page.pause();
   
   //click on cart button
   await page.locator("[routerlink*='cart']").click();
   //wait for section of product the first item
   await page.locator("div li").first().waitFor();
   //check visible for product text  >>> h3:has-text('ZARA COAT 3')
   const bool =await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
   //check is true or not
   expect(bool).toBeTruthy();
    //click on checkout based on text
   await page.locator("text=Checkout").click();
   // presssequentally 
   await page.locator("[placeholder*='Country']").pressSequentially("ind");
   // return all results
   const dropdowns = page.locator(".ta-results");


   // wait for dropdown lis
   await dropdowns.waitFor();
   const optionsCount = await dropdowns.locator("button").count();
   for(let i=0; i<optionsCount; ++i)
   {
     const text = await dropdowns.locator("button").nth(i).textContent();
      if(text ===" India")
      {
         //travese from  "ta-results"  and locator again to  "button" 
         await dropdowns.locator("button").nth(i).click();
         break;
      } 
   }


   //grab text from UI css selector traverse
   expect(page.locator(".user__name [type='text']").first()).toHaveText("anshika@gmail.com");

   //click on place order button
   await page.locator(".action__submit").click();
   
   //h1:has-text( ' Thankyou for the order.')
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

   //grap the text
    const  orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderID);


    
   await page.locator("button[routerlink*='myorders']").click();

   //---------------------------------
   //wait for table to be loaded 
   await page.locator("tbody").waitFor();
   //--------------------------------

   const rows = await page.locator("tbody tr");

   for(let i=0; i <await rows.count() ;i++)
   {
       const rowOrderId =await rows.nth(i).locator("th").textContent();
       if(orderID.includes(rowOrderId))
       {
         // kede 3adenda 2 buttons ->  tbody tr button
         //we need 1st first button using first()
         await rows.nth(i).locator("button").first().click();
         break;
       }

   }



   const orderIdDetails = await page.locator(".col-text").textContent();
        expect(orderID.includes(orderIdDetails)).toBeTruthy();

    const emailTitle =await page.locator("p:has-text('anshika@gmail.com')").first().isVisible();
         expect(emailTitle).toBeTruthy();

   const countryTitle =await page.locator("p:has-text('Country - India')").first().isVisible();
         expect(countryTitle).toBeTruthy();
   })




   
test.only('test 2', async () => {
   
   const page = await webContext.newPage();
   await page.goto("https://rahulshettyacademy.com/client");

   const email ="";
   const productName="ZARA COAT 3";
   const products = page.locator(".card-body");
     // retutn  product name based on CSSselector travser .className child 
   // first() return first item 
   // allTextContents  return array for all textcontents()

   const titles =await page.locator(".card-body b").first().allTextContents();
   console.log(titles)

})
