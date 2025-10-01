const { test,expect } = require('@playwright/test');
const { POmanager } = require('../pageObject/POmanager');
const {custometest} =  require('../utiles/test-base');
// json -> string (JSON.stringify)
// string -> js object  (JSON.parse)
// const dataset =  JSON.parse(JSON.stringify(require("../utiles/TestData.json"))); 
 const dataset =  JSON.parse(JSON.stringify(require("../utiles/MoreTestData.json"))); 



 custometest(`@web Sample Browser Context Playwright Test Login`, async ({page,testDataForOrder}) => {

      //create object from POmanager
      const ppmanager = new POmanager(page);


      //data sets
      // //create object from PageClass
      const loginPage = ppmanager.getLoginPage();
      // Login page go to URL 
      await loginPage.GoToUrl();
      //create  validLogin method
      await loginPage.validLogin(testDataForOrder.usename, testDataForOrder.password);




      //click on cart button
      const dashboardPage = ppmanager.getdashboardPage();
      //search for productName
      await dashboardPage.searchProduct(testDataForOrder.productname);
      //navigate to cart page 
      await dashboardPage.navigateToCart();



      const cartPage = ppmanager.getCartPage();
      await cartPage.VerifyProductIsDisplayed(testDataForOrder.productname);
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