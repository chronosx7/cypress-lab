import { api_sign_in_test_user } from "../utils/Sessions"
import Products from "../pages/Products"

describe('completes checkout', () => {
    beforeEach(() => {
        api_sign_in_test_user('demouser')
        cy.visit('https://www.bstackdemo.com/')
    })
    it.skip('logs in successfully', () => {
        const logout_btn = '#signin'
        const current_user_label = 'span.username'

        cy.get(current_user_label).should('be.visible')
        cy.get(logout_btn).scrollIntoView().should('be.visible').invoke('text').then((text) => {
            expect(text).to.equal('Logout')
        })
    })
    it('Allows checkout with 1+ items in cart', () => {
        Products.open_side_cart()
        Products.get_cart_chekout_btn().invoke('text').then((text) => {
            expect(text.toUpperCase()).to.equal('CONTINUE SHOPPING')
        })
        Products.get_cart_chekout_btn().click()
        Products.get_cart_container().should('not.be.visible')
        Products.add_product_to_cart(1)
        Products.get_cart_chekout_btn().invoke('text').then((text) => {
            expect(text.toUpperCase()).to.equal('CHECKOUT')
        })
    })
})

