import Products from "../pages/Products"
import { api_sign_in_test_user } from "../utils/Sessions"

describe('Web store and shopping cart actions', () => {
    before(() => {
        cy.clearAllSessionStorage()
    })
    beforeEach(() => {
        api_sign_in_test_user('demouser')
        cy.visit('https://www.bstackdemo.com/')
    })
    it.only('adds product to favorites', () => {
        Products.toggle_favorite_product(1)
        Products.is_marked_favorite(1).should('equal', true)

        Products.toggle_favorite_product(1)
        Products.is_marked_favorite(1).should('equal', false)
    })
})