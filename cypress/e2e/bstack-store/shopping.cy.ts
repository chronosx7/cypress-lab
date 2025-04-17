import ProductsPage from "./pages/ProductsPage"

describe('opens webpage', () => {
    beforeEach(()=>{
        cy.visit('https://www.bstackdemo.com/')
    })

    it('counts unfiltered products', () => {
        ProductsPage.get_listed_products().should('be.visible').its('length').then((length) => {
            ProductsPage.get_products_found_label().invoke('text').then((text) => {
                const count = ProductsPage.get_product_count(text)
                expect(count).to.equal(length)
            })
        })
    })

    it('counts filtered products', () => {
        ProductsPage.click_filter_button(0)
        ProductsPage.get_loading_spinner().should('not.exist')
        ProductsPage.get_listed_products().should('be.visible').its('length').then((length) => {
            ProductsPage.get_products_found_label().invoke('text').then((text) => {
                const count = ProductsPage.get_product_count(text)
                expect(count).to.equal(length)
            })
        })
    })

    it('counts products - multiple filters', () => {
        ProductsPage.get_listed_products().should('be.visible')
        ProductsPage.click_filter_button(0)
        ProductsPage.get_loading_spinner().should('not.exist')
        ProductsPage.click_filter_button(1)
        ProductsPage.get_loading_spinner().should('not.exist')
        ProductsPage.get_listed_products().should('be.visible').its('length').then((length) => {
            ProductsPage.get_products_found_label().invoke('text').then((text) => {
                const count = ProductsPage.get_product_count(text)
                expect(count).to.equal(length)
            })
        })
    })

    it('orders products by price - asc', () => {
        ProductsPage.get_listed_products().should('be.visible')
        ProductsPage.order_products_by_price_asc()
        ProductsPage.get_loading_spinner().should('not.exist')
        ProductsPage.get_price_labels().then(($items) => {
            const texts = $items.map((i, el) => Number(Cypress.$(el).text().trim())).get()
            const sorted = [...texts].sort((a, b) => a - b)
            expect(texts).to.deep.equal(sorted)
        })
    })

    it('orders products by price - desc', () => {
        ProductsPage.get_listed_products().should('be.visible')
        ProductsPage.order_products_by_price_desc()
        ProductsPage.get_loading_spinner().should('not.exist')
        ProductsPage.get_price_labels().then(($items) => {
            const texts = $items.map((i, el) => Number(Cypress.$(el).text().trim())).get()
            const sorted = [...texts].sort((a, b) => b - a)
            expect(texts).to.deep.equal(sorted)
        })
    })

    it('counts items in cart', () => {
        ProductsPage.add_product_to_cart(0)
        ProductsPage.close_side_cart()
        ProductsPage.add_product_to_cart(2)
        ProductsPage.close_side_cart()
        ProductsPage.add_product_to_cart(5)
        ProductsPage.get_cart_items().should('be.visible').its('length').then((length) => {
            expect(length).to.equal(3)
        })
        ProductsPage.get_cart_counter().should('be.visible').invoke('text').then((text) => {
            expect(text).to.equal('3')
        })
    })

    it('adds correct item to cart', () => {
        const product_index = 1
        ProductsPage.get_listed_products().should('be.visible').eq(product_index).then((el) => {
            const listed_product_data = ProductsPage.get_listed_product_data(el)

            ProductsPage.add_product_to_cart(product_index)
            ProductsPage.get_cart_items().should('be.visible').eq(0).then((el) => {
                const cart_product_data = ProductsPage.get_cart_product_data(el)

                expect(cart_product_data.name).to.equal(listed_product_data.name)
                expect(cart_product_data.price).to.equal(listed_product_data.price)
                expect(cart_product_data.quantity).to.equal(1)
            })
        })
    })

    it('updates cart with add/remove buttons', () => {
        ProductsPage.get_listed_products().should('be.visible').eq(0).then(() => {
            ProductsPage.add_product_to_cart(0)
            ProductsPage.get_cart_items().should('be.visible').eq(0).then((cart_items) => {
                const [btn_add, btn_remove] = ProductsPage.extract_change_item_buttons(cart_items)

                cy.wrap(btn_add).click()
                cy.wrap(btn_remove).should('be.enabled')
                cy.wrap(btn_add).click()
                ProductsPage.get_cart_footer().then((footer) => {
                    const product_data = ProductsPage.get_cart_product_data(cart_items)
                    const footer_data = ProductsPage.get_cart_footer_data(footer)

                    expect(product_data.quantity).to.equal(3)
                    expect(footer_data.sub_price).to.equal(product_data.price * 3)
                    expect(footer_data.installment_amount).to.equal(Number((footer_data.sub_price / footer_data.installments).toFixed(2)))
                })

                cy.wrap(btn_remove).click()
                ProductsPage.get_cart_footer().then((footer) => {
                    const product_data = ProductsPage.get_cart_product_data(cart_items)
                    const footer_data = ProductsPage.get_cart_footer_data(footer)

                    expect(product_data.quantity).to.equal(2)
                    expect(footer_data.sub_price).to.equal(product_data.price * 2)
                    expect(footer_data.installment_amount).to.equal(Number((footer_data.sub_price / footer_data.installments).toFixed(2)))
                })
                cy.wrap(btn_remove).click().should('be.disabled')
            })
        })
    })
})

