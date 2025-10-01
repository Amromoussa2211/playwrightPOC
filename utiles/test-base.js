const base = require('@playwright/test');


exports.custometest = base.test.extend(
    {
     testDataForOrder:
            {
                usename: "anshika@gmail.com",
                password: "Iamking@000",
                productname: "ZARA COAT 3"
            }

    }

)