const { test, expect } = require('@playwright/test');
const { POmanager } = require('../pageObject/POmanager');
// json -> string (JSON.stringify)
// string -> js object  (JSON.parse)
// const dataset =  JSON.parse(JSON.stringify(require("../utiles/TestData.json"))); 
 const dataset =  JSON.parse(JSON.stringify(require("../utiles/MoreTestData.json"))); 


for(var data of dataset) 
{

   test(`Sample Browser Context Playwright Test Login ${data.productname}`, async ({page}) => {

      //create object from POmanager
      const ppmanager = new POmanager(page);

      //data sets
      // //create object from PageClass
      const loginPage = ppmanager.getLoginPage();
      // Login page go to URL 
      await loginPage.GoToUrl();
      //create  validLogin method
      await loginPage.validLogin(data.usename, data.password);




      //click on cart button
      const dashboardPage = ppmanager.getdashboardPage();
      //search for productName
      await dashboardPage.searchProduct(data.productname);
      //navigate to cart page 
      await dashboardPage.navigateToCart();



      const cartPage = ppmanager.getCartPage();
      await cartPage.VerifyProductIsDisplayed(data.productname);
      await cartPage.Checkout();



      const ordersReviewPage = ppmanager.getOrdersReviewPage();
      await ordersReviewPage.searchCountryAndSelect("ind", "India");
      const orderId = await ordersReviewPage.SubmitAndGetOrderId();
      console.log(orderId);
      await dashboardPage.navigateToOrders();
      const ordersHistoryPage = ppmanager.getOrdersHistoryPage();
      await ordersHistoryPage.searchOrderAndSelect(orderId);
      expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();


   });
 
}




