import { ChainablePageElement } from "../utils/types"
import { CartItem } from "./Products"

class Checkout {
    private order_summary_container = '.layout-cart'
    private order_summary_total = '.cart-total .cart-priceItem-value'
    private order_summary_count = '.cart-section-heading'
    private order_summary_items = '.productList-item'

    private submit_button = '#checkout-shipping-continue'

    private form_first_name = '#firstNameInput'
    private form_last_name = '#lastNameInput'
    private form_address = '#addressLine1Input'
    private form_province = '#provinceInput'
    private form_postal_code = '#postCodeInput'

    private continue_shopping_btn = '.button--tertiary.optimizedCheckout-buttonSecondary'
    private order_receipt_link = '#downloadpdf'

    submit_form(): void {
        cy.get(this.submit_button).click()
    }

    get_list_total(): ChainablePageElement{
        return cy.get(this.order_summary_total)
    }

    get_order_summary(): Cypress.Chainable<{
        total_price: number,
        total_products: number,
        items: CartItem[]
    }> {
        return cy.get(this.order_summary_container).then((el) => {
            const total_price = Number(el.find(this.order_summary_total).text().trim().match(/\d+(?:\.\d{1,2})?$/))
            const total_products = Number(el.find(this.order_summary_count).text().trim().match(/^\d+/))
            const products = el.find(this.order_summary_items).toArray().map((item) => {
                const wrapped = Cypress.$(item)
                return {
                    'name': wrapped.find('.product-title').text().trim(),
                    'price': Number(wrapped.find('.product-actions .product-price').text().trim().match(/\d+(?:\.\d{1,2})?$/)),
                    'quantity': Number(wrapped.find('.product-options li').toArray()[1].textContent?.trim()),
                }
            })
            return {
                total_price,
                total_products,
                items: products
            }
        })
    }

    get_first_name(): ChainablePageElement {
        return cy.get(this.form_first_name)
    }

    get_last_name(): ChainablePageElement {
        return cy.get(this.form_last_name)
    }

    get_address(): ChainablePageElement {
        return cy.get(this.form_address)
    }

    get_province(): ChainablePageElement {
        return cy.get(this.form_province)
    }

    get_field_validity(field: JQuery<HTMLElement>): boolean{
        return (field[0] as HTMLInputElement).checkValidity()
    }

    get_postal_code(): ChainablePageElement {
        return cy.get(this.form_postal_code)
    }

    get_continue_shopping(): ChainablePageElement {
        return cy.get(this.continue_shopping_btn)
    }
    get_receipt_link(): ChainablePageElement {
        return cy.get(this.order_receipt_link)
    }
}

export default new Checkout()