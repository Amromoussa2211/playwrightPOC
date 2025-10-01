class APiUtils
{    
    constructor(apiContext,loginPayload)
    {
        this.apiContext =apiContext;
        this.loginPayload = loginPayload;
    }
    async getToken()
    {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                 data:this.loginPayload
            })
 
                 
                 const loginResponseJson=await loginResponse.json();
                 const token = await loginResponseJson.token;
                 console.log(token);
                 return token;
    }
 
    async createOrder(orderPayLoad)
    {
        let response ={};
        response.token= await this.getToken();
        const orderResponse= await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
            data : orderPayLoad,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
                 },
            })
            const orderResponseJson = await orderResponse.json();
            console.log(orderResponseJson);
            const orderId = orderResponseJson.orders[0];
            console.log(orderId);
            response.orderId = orderId;
     
            return response;
    }
 
 
}
module.exports = { APiUtils };
 