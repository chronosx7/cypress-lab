const product_request_alias = 'productsRequest'

const filter_buttons = '.filters span.checkmark'
const products_found_label = '.shelf-container-header .products-found'
const products_found = '.shelf-container .shelf-item'
const product_title = 'p.shelf-item__title'
const add_product_btn = '.shelf-item__buy-btn'
const brand_buttons = '.filters .filters-available-size .checkmark'

const loading_spinner = '.spinner'

const order_by_field = '.sort select'
const order_by_lowest_price = 'lowestprice'
const order_by_highest_price = 'highestprice'

const price_labels = '.shelf-item__price .val b'
const price_container = '.shelf-item__price .val'
const price_symbol = '.val small'
const price_dollars = '.val b'
const price_cents = '.val span'

const open_cart_drawer = '.float-cart .bag--float-cart-closed'
const close_cart_drawer = '.float-cart .float-cart__close-btn'
const cart_content_container = '.float-cart .float-cart__content'
const cart_items_counter = '.float-cart .bag__quantity'
const items_in_cart = '.float-cart__shelf-container .shelf-item'
const added_cart_items = cart_content_container + ' .shelf-item'

const cart_item_name = '.shelf-item__details .title'
const cart_item_price = '.shelf-item__price p'
const cart_item_quantity = '.shelf-item__details .desc'
const cart_footer = '.float-cart__footer'
const cart_change_item_buttons = '.shelf-item__price .change-product-button'

interface ProductData {
    name: string;
    currency: string;
    price: number;
    installments: number;
    installmentAmount: number;
}

interface CartItemData {
    name: string;
    price: number;
    quantity: number;
}

describe('opens webpage', () => {
    beforeEach(()=>{
        cy.intercept('GET', 'https://www.bstackdemo.com/api/products').as(product_request_alias)
        cy.visit('https://www.bstackdemo.com/')
    })

    it('has filter buttons', () => {
        cy.get(filter_buttons).should("be.visible").and("have.length", 4)
    })

    it('counts unfiltered products', () => {
        cy.get(products_found).should('be.visible').its('length').then((length) => {
            cy.get(products_found_label).invoke('text').then((text) => {
                const count = get_product_count(text)
                expect(count).to.equal(length)
            })
        })
    })

    it('counts filtered products', () => {
        cy.get(products_found).should('be.visible')
        cy.get(filter_buttons).eq(0).click()
        cy.get(loading_spinner).should('not.exist')
        cy.get(products_found).should('be.visible').its('length').then((length) => {
            cy.get(products_found_label).invoke('text').then((text) => {
                const count = get_product_count(text)
                expect(count).to.equal(length)
            })
        })
    })

    it('counts products - multiple filters', () => {
        cy.get(products_found).should('be.visible')
        cy.get(filter_buttons).eq(0).click()
        cy.get(loading_spinner).should('not.exist')
        cy.get(filter_buttons).eq(1).click()
        cy.get(loading_spinner).should('not.exist')
        cy.get(products_found).should('be.visible').its('length').then((length) => {
            cy.get(products_found_label).invoke('text').then((text) => {
                const count = get_product_count(text)
                expect(count).to.equal(length)
            })
        })
    })

    it('orders products by prices - asc', () => {
        cy.get(products_found).should('be.visible')
        cy.get(order_by_field).select(order_by_lowest_price)
        cy.get(loading_spinner).should('not.exist')
        cy.get(price_labels).then(($items) => {
            const texts = $items.map((i, el) => Number(Cypress.$(el).text().trim())).get()
            const sorted = [...texts].sort((a, b) => a - b)
            expect(texts).to.deep.equal(sorted)
        })
    })

    it('orders products by prices - desc', () => {
        cy.get(products_found).should('be.visible')
        cy.get(order_by_field).select(order_by_highest_price)
        cy.get(loading_spinner).should('not.exist')
        cy.get(price_labels).then(($items) => {
            const texts = $items.map((i, el) => Number(Cypress.$(el).text().trim())).get()
            const sorted = [...texts].sort((a, b) => b - a)
            expect(texts).to.deep.equal(sorted)
        })
    })

    it('counts items in cart', () => {
        add_product_to_cart(0)
        close_side_cart()
        add_product_to_cart(2)
        close_side_cart()
        add_product_to_cart(5)
        cy.get(cart_content_container).should('be.visible')
        cy.get(items_in_cart).should('be.visible').its('length').then((length) => {
            expect(length).to.equal(3)
        })
        cy.get(cart_items_counter).should('be.visible').invoke('text').then((text) => {
            expect(text).to.equal('3')
        })
    })

    it('adds correct item to cart', () => {
        const product_index = 1
        cy.get(products_found).should('be.visible').eq(product_index).then((el) => {
            const listed_product_data = get_listed_product_data(el)

            add_product_to_cart(product_index)
            cy.get(added_cart_items).should('be.visible').eq(0).then((el) => {
                const cart_product_data = get_cart_product_data(el)

                expect(cart_product_data.name).to.equal(listed_product_data.name)
                expect(cart_product_data.price).to.equal(listed_product_data.price)
                expect(cart_product_data.quantity).to.equal(1)
            })
        })
    })

    it.only('updates cart with add/remove buttons', () => {
        cy.get(products_found).should('be.visible').eq(0).then(() => {
            add_product_to_cart(0)
            cy.get(added_cart_items).should('be.visible').eq(0).then((cart_items) => {
                const [btn_add, btn_remove] = extract_change_item_buttons(cart_items)

                cy.wrap(btn_add).click()
                cy.wrap(btn_remove).should('be.enabled')
                cy.wrap(btn_add).click().get(cart_footer).then((footer) => {
                    const product_data = get_cart_product_data(cart_items)
                    const footer_data = get_cart_footer_data(footer)

                    expect(product_data.quantity).to.equal(3)
                    expect(footer_data.sub_price).to.equal(product_data.price * 3)
                    expect(footer_data.installmentAmount).to.equal(Number((footer_data.sub_price/footer_data.installments).toFixed(2)))
                })
                cy.wrap(btn_remove).click().get(cart_footer).then((footer) => {
                    const product_data = get_cart_product_data(cart_items)
                    const footer_data = get_cart_footer_data(footer)

                    expect(product_data.quantity).to.equal(2)
                    expect(footer_data.sub_price).to.equal(product_data.price * 2)
                    expect(footer_data.installmentAmount).to.equal(Number((footer_data.sub_price/footer_data.installments).toFixed(2)))
                })
                cy.wrap(btn_remove).click().should('be.disabled')
            })
        })
    })
})

function get_listed_product_data(el: JQuery<HTMLElement>): ProductData {
    const price_regex = /[0-9]+/;
    const name = el.find(product_title).text().trim();
    const currency = el.find(price_symbol).text().trim();
    const price = Number(el.find(price_container).text().trim().match(price_regex))
    const installments = Number(el.find('.installment span').text().trim().match(price_regex))
    const installmentAmount = Number(el.find('.installment b').text().trim().match(price_regex))

    return {
        name,
        currency,
        price,
        installments,
        installmentAmount
    }
}

function get_cart_product_data(el: JQuery<HTMLElement>): CartItemData {
    const name = el.find(cart_item_name).text().trim()
    const price = Number(el.find(cart_item_price).text().match(/[0-9]+/))
    const quantity = Number(el.find(cart_item_quantity).text().match(/[0-9]+/))

    return {
        name,
        price,
        quantity
    }
}

function get_product_count(text:String): Number {
    const count = text.match(/[0-9]+/)
    if(count) {
        return Number(count[0])
    }
    else {
        return 0
    }
}

function open_side_cart() {
    cy.get(open_cart_drawer).click()
}

function close_side_cart() {
    cy.get(close_cart_drawer).click()
}

function add_product_to_cart(index: number){
    cy.get(products_found).should('be.visible').eq(index).find(add_product_btn).click()
}

function extract_change_item_buttons(el: JQuery<HTMLElement>): JQuery<HTMLElement>[] {
    return [
        el.find('button.change-product-button').filter((_, btn) =>  btn.textContent?.trim() === '+'),
        el.find('button.change-product-button').filter((_, btn) =>  btn.textContent?.trim() === '-')
    ]
}

function get_cart_footer_data(el: JQuery<HTMLElement>): {sub_price: number; installments: number; installmentAmount: number;} {
    const str_sub_price = el.find('.sub-price__val')
    const str_installments = el.find('.sub-price__installment span')
    let sub_price = 0
    let installments = 0
    let installmentAmount = 0

    if(str_sub_price.length > 0) {
        sub_price = Number(str_sub_price[0].textContent?.trim().match(/[0-9]+/))
    }
    if(str_installments.length > 0) {
        installments = Number(str_installments[0].textContent?.trim().match(/(?<=UP TO\s*)\d+/))
        installmentAmount = Number(str_installments[0].textContent?.trim().match(/\d+(?:\.\d{1,2})?$/))
    }

    return {
        sub_price,
        installments,
        installmentAmount
    }
    
}