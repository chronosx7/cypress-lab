import Products from "../pages/Products"
import { ListProductData } from "../pages/Products"
import { api_sign_in_test_user } from "../utils/Sessions"

describe('Manage favorite products section', () => {
    before(() => {
        cy.clearAllSessionStorage()
        Cypress.session.clearAllSavedSessions()
    })
    beforeEach(() => {
        api_sign_in_test_user('demouser')
        cy.visit('https://www.bstackdemo.com/')
    })

    it('adds product to favorites', () => {
        Products.toggle_favorite_product(2)
        Products.is_marked_favorite(2).should('equal', true)

        Products.toggle_favorite_product(3)
        Products.is_marked_favorite(3).should('equal', true)

        Products.get_displayed_products().then(() => {
            const fave_products = []
            fave_products.push(Products.sync_read_listed_product_data(2))
            fave_products.push(Products.sync_read_listed_product_data(3))
            cy.wrap(fave_products).as('fave_products')
        })

        cy.get('a#favourites').click()
        cy.url().should('contain', 'favourites')

        // Favorites page lists number of favorite products
        Products.get_displayed_products_count().should('equal', 2)

        // Products marked favorite in store are listed in favorites pages
        cy.get<ListProductData[]>('@fave_products').then((faves) => {
            const fave_names = faves.map((fave) => { return fave.name })
            expect(fave_names.includes(Products.sync_read_listed_product_data(0).name)).to.equal(true)
            expect(fave_names.includes(Products.sync_read_listed_product_data(1).name)).to.equal(true)
        })

    })
    // Products unmarked as favorite in favorites pages update instantly
    // Favorites page list number of favorite products
    it.only('Favorite page updates immediately', () => {

    })
    
    // Products in favorites can be added to shopping cart
    // Purchase flow can be completed starting in favorite page
})

