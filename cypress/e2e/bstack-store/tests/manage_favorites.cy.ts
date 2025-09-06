import Products from "../pages/Products"
import { ListProductData } from "../pages/Products"
import { api_sign_in_test_user } from "../utils/Sessions"
import { CartItem } from "../pages/Products"
import Checkout from "../pages/Checkout"

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

        Products.get_displayed_products_count().should('equal', 2)

        cy.get<ListProductData[]>('@fave_products').then((faves) => {
            const fave_names = faves.map((fave) => { return fave.name })
            expect(fave_names.includes(Products.sync_read_listed_product_data(0).name)).to.equal(true)
            expect(fave_names.includes(Products.sync_read_listed_product_data(1).name)).to.equal(true)
        })

    })
    // Products unmarked as favorite in favorites pages update instantly
    // Favorites page list number of favorite products
    it('Favorite page updates immediately', () => {
        Products.toggle_favorite_product(2)
        Products.is_marked_favorite(2).should('equal', true)

        Products.toggle_favorite_product(3)
        Products.is_marked_favorite(3).should('equal', true)

        cy.get('a#favourites').click()
        cy.url().should('contain', 'favourites')

        Products.get_displayed_products_count().should('equal', 2)

        Products.toggle_favorite_product(1)

        Products.get_displayed_products_count().should('equal', 1)
    })
    
    // Products in favorites can be added to shopping cart
    // Purchase flow can be completed starting in favorite page
    it('Loads cart from favorites page', () => {
        let prev_cart: {
            contents: CartItem[], 
            footer: {subtotal: number, installments: number, installments_amnt: number}
        }
        Products.toggle_favorite_product(2)
        Products.toggle_favorite_product(3)

        cy.get('a#favourites').click()
            .url().should('contain', 'favourites')

        Products.add_product_to_cart(0)
        Products.close_side_cart()
        Products.add_product_to_cart(0)
        Products.close_side_cart()
        Products.add_product_to_cart(1)

        Products.side_cart_is_open().then(() => {
            const product_1 = Products.sync_read_listed_product_data(0)
            const product_2 = Products.sync_read_listed_product_data(1)
            const cart_contents = Products.sync_read_cart_contents()
            const footer = Products.sync_read_cart_footer()
            const expected_subtotal = cart_contents.reduce((price_sum, current) => { 
                return price_sum += current.price * current.quantity
            }, 0)

            expect(product_1.name).to.equal(cart_contents[0].name)
            expect(product_2.name).to.equal(cart_contents[1].name)
            expect(product_1.price).to.equal(cart_contents[0].price)
            expect(product_2.price).to.equal(cart_contents[1].price)
            expect(cart_contents[0].quantity).to.equal(2)
            expect(cart_contents[1].quantity).to.equal(1)
            expect(footer.subtotal).to.equal(expected_subtotal)

            prev_cart = {
                'contents': cart_contents,
                'footer': footer
            }
        })

        Products.click_checkout_btn()
        cy.url().should('contain', 'checkout').then(() => {
            Checkout.get_order_summary().then((current_cart) => {
                let found_names = 0
                let product_count = 0
    
                for(const current of current_cart.items) {
                    for(const prev of prev_cart.contents) {
                        if(current.name == prev.name) {
                            expect(current.quantity).to.equal(prev.quantity)
                            found_names++
                            product_count += prev.quantity
                        }
                    }
                }
   
                expect(found_names).to.equal(prev_cart.contents.length)
                expect(prev_cart.footer.subtotal).to.equal(current_cart.total_price)
                expect(current_cart.product_count).to.equal(product_count)
            })
        })
    })
})

