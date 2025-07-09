import { api_sign_in_test_user } from "../utils/Sessions"
import Products from "../pages/Products"
import { CartData } from "../pages/Products"
import Checkout from "../pages/Checkout"

describe('completes checkout', () => {
    beforeEach(() => {
        api_sign_in_test_user('demouser')
        cy.visit('https://www.bstackdemo.com/')
    })
    it('logs in successfully', () => {
        const logout_btn = '#signin'
        const current_user_label = 'span.username'

        cy.get(current_user_label).should('be.visible')
        cy.get(logout_btn).scrollIntoView().should('be.visible').invoke('text').should('match', /logout/i)
    })
    it('Allows checkout with 1+ items in cart', () => {
        Products.open_side_cart()
        Products.get_checkout_btn_text().should('match', /continue shopping/i)
        Products.click_checkout_btn()
        Products.get_cart_container().should('not.be.visible')
        Products.add_product_to_cart(1)
        Products.get_checkout_btn_text().should('match', /checkout/i)
    })
    it('stores product data for checkout', () => {
        Products.add_product_to_cart(1)
        Products.close_side_cart()
        Products.add_product_to_cart(2)
        Products.close_side_cart()
        Products.add_product_to_cart(2)
        Products.close_side_cart()
        Products.add_product_to_cart(3)

        Products.get_cart_data().then((data) => {
            cy.wrap(data).as('initial_cart_data')
        })
        Products.click_checkout_btn()
        cy.url().should('include', '/checkout')

        cy.get<CartData>('@initial_cart_data').then((cart) => {
            Checkout.get_order_summary().then((summary) => {
                expect(cart.subtotal ).to.equal(summary.total_price)
                expect(cart.items.length).to.equal(summary.items.length)
                cart.items.forEach((item, i) => {
                    expect(item.name).to.equal(summary.items[i].name);
                    expect(item.quantity).to.equal(summary.items[i].quantity);
                    expect(item.price * item.quantity).to.equal(summary.items[i].price);
                })
            })
        })
    })
    it.only('shipping form is filled before proceeding', () => {
        Products.add_product_to_cart(1)
        Products.click_checkout_btn()
        cy.url().should('include', '/checkout')
        
        Checkout.submit_form()
        cy.url().should('include', '/checkout')
        
        Checkout.get_first_name().checkValidity().should('equal', false)
        Checkout.get_first_name().type('John').checkValidity().should('equal', true)

        Checkout.submit_form()
        cy.url().should('include', '/checkout')
        
        Checkout.get_last_name().checkValidity().should('equal', false)
        Checkout.get_last_name().type('Doe').checkValidity().should('equal', true)

        Checkout.submit_form()
        cy.url().should('include', '/checkout')

        Checkout.get_address().checkValidity().should('equal', false)
        Checkout.get_address().type('123 Mulholland Dr').checkValidity().should('equal', true)

        Checkout.submit_form()
        cy.url().should('include', '/checkout')

        Checkout.get_province().checkValidity().should('equal', false)
        Checkout.get_province().type('Palo Alto').checkValidity().should('equal', true)

        Checkout.submit_form()
        cy.url().should('include', '/checkout')

        Checkout.get_postal_code().checkValidity().should('equal', false)
        Checkout.get_postal_code().type('abcABC').checkValidity().should('equal', true)

        Checkout.submit_form()
        cy.url().should('include', '/confirmation')
    })
    it('Confirms order was placed', () => {
        Products.add_product_to_cart(1)
        Products.close_side_cart()
        Products.add_product_to_cart(2)
        Products.get_cart_chekout_btn().click()

        Checkout.get_first_name().type('John')
        Checkout.get_last_name().type('Doe')
        Checkout.get_address().type('123 Mulholland Dr')
        Checkout.get_province().type('Palo Alto')
        Checkout.get_postal_code().type('abcABC')
        Checkout.submit_form()
        
        Checkout.get_receipt_link().should('be.visible')
        Checkout.get_continue_shopping().should('be.visible').should('be.enabled').click()

        cy.url().should('eq', 'https://www.bstackdemo.com/')

    })
})

