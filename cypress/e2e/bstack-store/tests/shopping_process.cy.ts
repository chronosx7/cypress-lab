import Products from "../pages/Products"

describe('Web store and shopping cart actions', () => {
    beforeEach(()=>{
        cy.visit('https://www.bstackdemo.com/')
    })

    it('counts unfiltered products', () => {
        Products.get_displayed_products().its('length').then((length) => {
            Products.get_displayed_products_count().should('eq', length)
        })
    })

    it('counts filtered products', () => {
        Products.click_filter_button(0)
        Products.wait_for_spinner()
        Products.get_displayed_products().its('length').then((length) => {
            Products.get_displayed_products_count().should('eq', length)
        })
    })

    it('counts products - multiple filters', () => {
        Products.get_displayed_products()
        Products.click_filter_button(0)
        Products.wait_for_spinner()
        Products.click_filter_button(1)
        Products.wait_for_spinner()
        Products.get_displayed_products().its('length').then((length) => {
            Products.get_displayed_products_count().should('eq', length)
        })
    })

    it('orders products by price - asc', () => {
        Products.get_displayed_products()
        Products.order_products_by_price_asc()
        Products.wait_for_spinner()
        Products.get_displayed_product_prices().then(($items) => {
            const texts = $items.map((_, el) => Number(Cypress.$(el).text().trim())).get()
            const sorted = [...texts].sort((a, b) => a - b)
            expect(texts).to.deep.equal(sorted)
        })
    })

    it('orders products by price - desc', () => {
        Products.get_displayed_products()
        Products.order_products_by_price_desc()
        Products.wait_for_spinner()
        Products.get_displayed_product_prices().then(($items) => {
            const texts = $items.map((_, el) => Number(Cypress.$(el).text().trim())).get()
            const sorted = [...texts].sort((a, b) => b - a)
            expect(texts).to.deep.equal(sorted)
        })
    })

    it('counts items in cart', () => {
        Products.add_product_to_cart(0)
        Products.close_side_cart()
        Products.add_product_to_cart(2)
        Products.close_side_cart()
        Products.add_product_to_cart(5)
        Products.get_cart_items().its('length').should('equal', 3)
        Products.get_cart_counter().invoke('text').should('equal', '3')
    })

    it('adds correct item to cart', () => {
        const product_index = 1
        Products.get_displayed_products()
        Products.add_product_to_cart(product_index)
        Products.get_displayed_products().eq(product_index).then(() => {
            const listed_product_data = Products.sync_read_listed_product_data(product_index)
            const cart_product_data = Products.sync_read_cart_product_data(0)

            expect(cart_product_data.name).to.equal(listed_product_data.name)
            expect(cart_product_data.price).to.equal(listed_product_data.price)
            expect(cart_product_data.quantity).to.equal(1)
        })
    })

    it.only('updates cart with add/remove buttons', () => {
        Products.get_displayed_products()
        Products.add_product_to_cart(0)
        Products.increase_cart_product(0)
        Products.check_decrease_button_enabled(0).should('eq', true)
        Products.increase_cart_product(0)
        cy.then(() => {
            const cart_products = Products.sync_read_cart_contents()
            const footer_data = Products.sync_read_cart_footer()
    
            expect(cart_products.length).to.equal(1)
            expect(cart_products[0].quantity).to.equal(3)
            expect(cart_products[0].quantity * cart_products[0].price).to.equal(footer_data.subtotal)
            expect(footer_data.installments_amnt).to.equal(Number((footer_data.subtotal / footer_data.installments).toFixed(2)))
        })
    })
})

