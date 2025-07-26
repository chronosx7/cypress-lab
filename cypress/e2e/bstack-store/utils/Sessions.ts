export function api_sign_in_test_user(username: string): void {
    cy.session(`${username}-session`,() => {
        cy.fixture('test_users').then((data) => {
            const user = data.users[username]
            cy.request({
                method: 'POST',
                url: 'https://www.bstackdemo.com/api/signin',
                body: {
                    userName: user.userName,
                    password: user.password
                }
            }).then(() => {
                cy.window().then((win) => {
                    win.sessionStorage.setItem('username', user.userName)
                })
            })
        })
    
    })
}
/**
 * TODOS - Checkout
 * - Continue Shopping button changes to Checkout when there are items in cart
 * - Checkout button navigates to /checkout
 * - Shipping address form must be full before submitting a purchase
 * - There's an order summary on the right. All added items are listed
 * - List on the right shows number of items, price and units of each item
 * - Total is shown on the right at the end of the list
 * - Total doesn't change between pages
 * - Form submission navigates to /confirmation
 * 
 * - Confirmation page shows
 *      - An order number
 *      - Items list with total on the right
 *      - Link to download a receipt
 *      - Continue shopping button
 * - Continue shopping button takes the user back to the store with an empty shopping cart
 */