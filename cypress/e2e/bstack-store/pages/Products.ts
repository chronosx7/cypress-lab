import { ChainableJQueryElement } from "../utils/types"

interface CartItem {
    name: string;
    desc: string;
    price: number;
    quantity: number;
}
  
interface CartItem2 {
    name: string;
    price: number;
    quantity: number;
}
  
interface CartData {
    items: CartItem2[];
    subtotal: number;
    number_installments: number;
    installment_amount: number;
}

interface ListProductData {
    name: string;
    currency: string;
    price: number;
    number_installments: number;
    installment_amount: number;
}

class Products {
    
    private filter_buttons = '.filters span.checkmark'
    private displayed_products_label = '.shelf-container-header .products-found'
    private displayed_products = '.shelf-container .shelf-item'
    private product_title = 'p.shelf-item__title'
    private add_product_btn = '.shelf-item__buy-btn'
    
    private loading_spinner = '.spinner'
    
    private order_by_field = '.sort select'
    private order_by_lowest_price = 'lowestprice'
    private order_by_highest_price = 'highestprice'
    
    private price_labels = '.shelf-item__price .val b'
    private price_container = '.shelf-item__price .val'
    private price_symbol = '.val small'
    
    private cart_container = '.float-cart'
    private cart_contents = '.float-cart .float-cart__content'
    private cart_products = '.float-cart__shelf-container .shelf-item'
    private cart_footer = '.float-cart__footer'
    private cart_checkout_btn = '.float-cart__footer .buy-btn'

    private open_cart_button = '.float-cart .bag--float-cart-closed'
    private close_cart_button = '.float-cart .float-cart__close-btn'
    private cart_items_counter = '.float-cart .bag__quantity'
    private items_in_cart = '.float-cart__shelf-container .shelf-item'
    
    private cart_item_name = '.shelf-item__details .title'
    private cart_item_price = '.shelf-item__price p'
    private cart_item_quantity = '.shelf-item__details .desc'
    private cart_change_item_buttons = 'button.change-product-button'

    private price_regex = /\d+(?:\.\d{1,2})?/

    unused_method() {
        console.log('unused')
    }

    get_listed_product_data(el: JQuery<HTMLElement>): ListProductData {
        const name = el.find(this.product_title).text().trim();
        const currency = el.find(this.price_symbol).text().trim();
        const price = Number(el.find(this.price_container).text().trim().match(this.price_regex))
        const installments = Number(el.find('.installment span').text().trim().match(this.price_regex))
        const installmentAmount = Number(el.find('.installment b').text().trim().match(this.price_regex))

        return {
            name,
            currency,
            price,
            number_installments: installments,
            installment_amount: installmentAmount
        }
    }

    sync_read_listed_product_data(index: number): ListProductData {
        const products = Cypress.$(this.displayed_products)
        const target = Cypress.$(products?.[index])

        const name = target.find(this.product_title).text().trim();
        const currency = target.find(this.price_symbol).text().trim();
        const price = Number(target.find(this.price_container).text().trim().match(this.price_regex))
        const installments = Number(target.find('.installment span').text().trim().match(this.price_regex))
        const installmentAmount = Number(target.find('.installment b').text().trim().match(this.price_regex))
    
        return {
            name,
            currency,
            price,
            number_installments: installments,
            installment_amount: installmentAmount
        }
    }

    increase_cart_product(index: number) {
        cy.get(this.cart_products).eq(index)
            .find('.change-product-button').should('be.visible')
            .filter((_, el) => el.textContent === '+')
            .click()
    }
    
    decrease_cart_product(index: number) {
        cy.get(this.cart_products).eq(index)
            .find('.change-product-button').should('be.visible')
            .filter((_, el) => el.textContent === '-')
            .click()
    }

    check_decrease_button_enabled(index: number): Cypress.Chainable<boolean> {
        return cy.get(this.cart_products).eq(index)
            .find('.change-product-button').should('be.visible')
            .filter((_, el) => el.textContent === '-').then(btn => {
                return !btn.prop('disabled')
            })
    }
    
    get_cart_product_data(el: JQuery<HTMLElement>): CartItem2 {
        const name = el.find(this.cart_item_name).text().trim()
        const price = Number(el.find(this.cart_item_price).text().match(this.price_regex))
        const quantity = Number(el.find(this.cart_item_quantity).text().match(this.price_regex))
    
        return {
            name,
            price,
            quantity
        }
    }

    sync_read_cart_product_data(index: number): CartItem2 {
        const cart_items = Cypress.$(this.items_in_cart)
        const target = Cypress.$(cart_items?.[index])

        const name = target.find(this.cart_item_name).text().trim()
        const price = Number(target.find(this.cart_item_price).text().match(this.price_regex))
        const quantity = Number(target.find(this.cart_item_quantity).text().match(this.price_regex))
    
        return {
            name,
            price,
            quantity
        }

    }

    get_displayed_products(): ChainableJQueryElement {
        return cy.get(this.displayed_products).should('be.visible')
    }

    wait_for_spinner(): Cypress.Chainable {
        return cy.get(this.loading_spinner).should('not.exist')
    }

    get_displayed_product_prices(): ChainableJQueryElement {
        return cy.get(this.price_labels)
    }
    
    get_displayed_products_count(): Cypress.Chainable<number> {
        return cy.get(this.displayed_products_label).invoke('text').then(text => {
            const count = text.match(/\d+/)
            return count? Number(count[0]): -1
        })
    }

    get_products_found_label(): ChainableJQueryElement {
        return cy.get(this.displayed_products_label)
    }

    get_cart_container(): ChainableJQueryElement {
        return cy.get(this.cart_container)
    }

    get_cart_contents(): ChainableJQueryElement {
        return cy.get(this.cart_contents)
    }

    sync_read_cart_contents(): CartItem[] {
        const contents = Cypress.$(this.cart_products)
        const product_data = []
        for(const product of contents) {
            const name = Cypress.$(product).find('.shelf-item__details .title').text().trim();
            const desc = Cypress.$(product).find('.shelf-item__details .desc').text().match(/^[a-zA-Z]+/)?.[0] || '';
            const quantity = Number( Cypress.$(product).find('.shelf-item__details .desc').text().match(this.price_regex)?.[0]) || 0;
            const price = Number(Cypress.$(product).find('.shelf-item__price p').text().match(this.price_regex)?.[0]) || 0;
            product_data.push({
                "name": name,
                "desc": desc,
                "quantity": quantity,
                "price": price,
            })
        }
        return product_data
    }

    sync_read_cart_footer() {
        const footer = Cypress.$(this.cart_footer)
        const subtotal = Number(footer.find('.sub-price__val').text().match(this.price_regex))
        const installments = Number(footer.find('.sub-price__installment span').text().match(/(?<=UP TO\s*)\d+/))
        // price_regex can't be used here since there are 2 number values in the same string
        const installments_amnt = Number(footer.find('.sub-price__installment span').text().match(/\d+(?:\.\d{1,2})?$/))
        
        return {
            subtotal,
            installments,
            installments_amnt
        }
    }

    get_cart_items(): ChainableJQueryElement {
        return cy.get(this.items_in_cart).should('be.visible')
    }

    get_cart_footer(): ChainableJQueryElement {
        return cy.get(this.cart_footer)
    }

    get_cart_counter(): ChainableJQueryElement {
        return cy.get(this.cart_items_counter).should('be.visible')
    }

    click_filter_button(index: number): void {
        cy.get(this.filter_buttons).should('be.visible').eq(index).click()
    }
    
    order_products_by_price_asc(): void {
        cy.get(this.order_by_field).select(this.order_by_lowest_price)
    }

    order_products_by_price_desc(): void {
        cy.get(this.order_by_field).select(this.order_by_highest_price)
    }
    
    open_side_cart(): void {
        cy.get(this.open_cart_button).click()
    }
    
    close_side_cart(): void {
        cy.get(this.close_cart_button).click()
    }

    side_cart_is_open(): Cypress.Chainable {
        return cy.get(this.cart_contents).should('be.visible')
    }
    
    add_product_to_cart(index: number): void {
        cy.get(this.displayed_products).should('be.visible').eq(index).find(this.add_product_btn).click()
    }

    extract_change_item_buttons(el: JQuery<HTMLElement>): JQuery<HTMLElement>[] {
        return [
            el.find(this.cart_change_item_buttons).filter((_, btn) =>  btn.textContent?.trim() === '+'),
            el.find(this.cart_change_item_buttons).filter((_, btn) =>  btn.textContent?.trim() === '-')
        ]
    }

    get_cart_footer_data(el: JQuery<HTMLElement>): {
        subtotal: number;
        number_installments: number;
        installment_amount: number;
    } {
        const str_sub_price = el.find('.sub-price__val')
        const str_installments = el.find('.sub-price__installment span')
        let sub_price = 0
        let number_installments = 0
        let installment_amount = 0
    
        if(str_sub_price.length > 0) {
            sub_price = Number(str_sub_price[0].textContent?.trim().match(this.price_regex))
        }
        if(str_installments.length > 0) {
            number_installments = Number(str_installments[0].textContent?.trim().match(/(?<=UP TO\s*)\d+/))
            installment_amount = Number(str_installments[0].textContent?.trim().match(/\d+(?:\.\d{1,2})?$/))
        }
    
        return {
            subtotal: sub_price,
            number_installments: number_installments,
            installment_amount: installment_amount
        }
        
    }

    get_cart_chekout_btn(): ChainableJQueryElement {
        return cy.get(this.cart_checkout_btn)
    }

    get_cart_data(): Cypress.Chainable<CartData>{
        return cy.get(this.cart_container).then((el) => {
            const footer_data = this.get_cart_footer_data(el)
            const items = el.find(this.items_in_cart).toArray().map(item => this.get_cart_product_data(Cypress.$(item)) ) 
            
            return {
                items,
                subtotal: footer_data.subtotal,
                number_installments: footer_data.number_installments,
                installment_amount: footer_data.installment_amount
            }
        })
    }
}

export default new Products()