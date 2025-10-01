Feature: Ecommerce validations

  Scenario: Placing the order
    Given a login to Ecommerce application with "username" and "password"
    When Add "zarz coat 3" to Cart
    Then Verify "zarz coat 3" is displayed in the cart 
    When Enter valid details and place the order
    Then Verify order in present on the OrderHistory
    
