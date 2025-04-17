type ChainablePageElement = Cypress.Chainable<JQuery<HTMLElement>>

class ProductsPage {
    
    private filter_buttons = '.filters span.checkmark'
    private products_found_label = '.shelf-container-header .products-found'
    private products_found = '.shelf-container .shelf-item'
    private product_title = 'p.shelf-item__title'
    private add_product_btn = '.shelf-item__buy-btn'
    
    private loading_spinner = '.spinner'
    
    private order_by_field = '.sort select'
    private order_by_lowest_price = 'lowestprice'
    private order_by_highest_price = 'highestprice'
    
    private price_labels = '.shelf-item__price .val b'
    private price_container = '.shelf-item__price .val'
    private price_symbol = '.val small'
    
    private open_cart_drawer = '.float-cart .bag--float-cart-closed'
    private close_cart_drawer = '.float-cart .float-cart__close-btn'
    private cart_contents = '.float-cart .float-cart__content'
    private cart_items_counter = '.float-cart .bag__quantity'
    private items_in_cart = '.float-cart__shelf-container .shelf-item'
    
    private cart_item_name = '.shelf-item__details .title'
    private cart_item_price = '.shelf-item__price p'
    private cart_item_quantity = '.shelf-item__details .desc'
    private cart_footer = '.float-cart__footer'
    private cart_change_item_buttons = 'button.change-product-button'

    private price_regex = /\d+(?:\.\d{1,2})?/
    
    get_listed_product_data(el: JQuery<HTMLElement>): {
        name: string;
        currency: string;
        price: number;
        installments: number;
        installment_amount: number;
    } {
        const name = el.find(this.product_title).text().trim();
        const currency = el.find(this.price_symbol).text().trim();
        const price = Number(el.find(this.price_container).text().trim().match(this.price_regex))
        const installments = Number(el.find('.installment span').text().trim().match(this.price_regex))
        const installmentAmount = Number(el.find('.installment b').text().trim().match(this.price_regex))
    
        return {
            name,
            currency,
            price,
            installments,
            installment_amount: installmentAmount
        }
    }
    
    get_cart_product_data(el: JQuery<HTMLElement>): {
        name: string;
        price: number;
        quantity: number;
    } {
        const name = el.find(this.cart_item_name).text().trim()
        const price = Number(el.find(this.cart_item_price).text().match(this.price_regex))
        const quantity = Number(el.find(this.cart_item_quantity).text().match(this.price_regex))
    
        return {
            name,
            price,
            quantity
        }
    }

    get_listed_products(): ChainablePageElement {
        return cy.get(this.products_found)
    }

    get_loading_spinner(): ChainablePageElement {
        return cy.get(this.loading_spinner)
    }

    get_price_labels(): ChainablePageElement {
        return cy.get(this.price_labels)
    }
    
    get_product_count(text:String): Number {
        const count = text.match(/\d+/)
        if(count) {
            return Number(count[0])
        }
        else {
            return 0
        }
    }

    get_products_found_label(): ChainablePageElement {
        return cy.get(this.products_found_label)
    }

    get_cart_contents(): ChainablePageElement {
        return cy.get(this.cart_contents)
    }

    get_cart_items(): ChainablePageElement {
        return cy.get(this.items_in_cart)
    }

    get_cart_footer(): ChainablePageElement {
        return cy.get(this.cart_footer)
    }

    get_cart_counter(): ChainablePageElement {
        return cy.get(this.cart_items_counter)
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
        cy.get(this.open_cart_drawer).click()
    }
    
    close_side_cart(): void {
        cy.get(this.close_cart_drawer).click()
    }
    
    add_product_to_cart(index: number): void {
        cy.get(this.products_found).should('be.visible').eq(index).find(this.add_product_btn).click()
    }

    extract_change_item_buttons(el: JQuery<HTMLElement>): JQuery<HTMLElement>[] {
        return [
            el.find(this.cart_change_item_buttons).filter((_, btn) =>  btn.textContent?.trim() === '+'),
            el.find(this.cart_change_item_buttons).filter((_, btn) =>  btn.textContent?.trim() === '-')
        ]
    }
    
    get_cart_footer_data(el: JQuery<HTMLElement>): {
        sub_price: number;
        installments: number;
        installment_amount: number;
    } {
        const str_sub_price = el.find('.sub-price__val')
        const str_installments = el.find('.sub-price__installment span')
        let sub_price = 0
        let installments = 0
        let installment_amount = 0
    
        if(str_sub_price.length > 0) {
            sub_price = Number(str_sub_price[0].textContent?.trim().match(this.price_regex))
        }
        if(str_installments.length > 0) {
            installments = Number(str_installments[0].textContent?.trim().match(/(?<=UP TO\s*)\d+/))
            installment_amount = Number(str_installments[0].textContent?.trim().match(/\d+(?:\.\d{1,2})?$/))
        }
    
        return {
            sub_price,
            installments,
            installment_amount: installment_amount
        }
        
    }
}

export default new ProductsPage()