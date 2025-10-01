const { LoginPage } = require('../pageObject/LoginPage')
const { DashboardPage } = require('../pageObject/DashboardPage')
const {OrdersHistoryPage} = require('./OrdersHistoryPage');
const {OrderReviewPage} = require('./OrderReviewPage');
const {CartPage} = require('./CartPage');


class POmanager {
    constructor(page) {

        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage(this.page);
        this.ordersReviewPage = new OrderReviewPage(this.page);
        this.cartPage = new CartPage(this.page);

    }


    getLoginPage() {
        return this.loginPage;
    }


    getCartPage() {
        return this.cartPage;
    }

    getdashboardPage() {
        return this.dashboardPage;
    }
    getOrdersHistoryPage() {
        return this.ordersHistoryPage;
    }

    getOrdersReviewPage() {
        return this.ordersReviewPage;
    }

}


module.exports = { POmanager };