class LoginPage {


    constructor(page) {
        this.page = page;
        this.userName = page.locator("#userEmail");
        this.userPassword = page.locator("#userPassword");
        this.signInbutton = page.locator("[value='Login']");
    }

    async validLogin(username, password) {
        await this.userName.fill(username);
        await this.userPassword.fill(password);
        await this.signInbutton.click();
          // wait for page load
        await this.page.waitForLoadState('networkidle');
    }


    async GoToUrl() {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

}

module.exports = { LoginPage };