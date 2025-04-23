import { api_sign_in_test_user } from "../utils/Sessions"

describe('completes checkout', () => {
    beforeEach(() => {
        api_sign_in_test_user('demouser')
        cy.visit('https://www.bstackdemo.com/')
    })
    it('logs in successfully', () => {
        const logout_btn = '#signin'
        const current_user_label = 'span.username'

        cy.get(current_user_label).should('be.visible')
        cy.get(logout_btn).scrollIntoView().should('be.visible').invoke('text').then((text) => {
            expect(text).to.equal('Logout')
        })
    })
})

