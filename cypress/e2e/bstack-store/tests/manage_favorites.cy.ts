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
    // Products makerd favorite in store are listed in favorites pages
    // Products unmarked as favorite in store are not listed in favorites pages
        // Favorites page list number of favorite products
    // Products unmarked as favorite in favorites pages update instantly
        // Favorites page list number of favorite products
    // Products in favorites can be added to shopping cart
    // Purchase flow can be completed starting in favorite page
})

