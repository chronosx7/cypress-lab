// const table = 'table.tab'
const rows = 'table.tab > tbody > tr'

Cypress.on('uncaught:exception', (err, runnable) => {
    // Optional: Add conditions here to filter specific errors
    // e.g., if (err.message.includes('ResizeObserver loop limit exceeded')) return false;
  
    // returning false here prevents Cypress from failing the test
    return false;
  });

describe('retrieves pokemon stats', () => {
    beforeEach(() => {
        cy.visit('https://www.serebii.net/conquest/pokemon.shtml')
    })
    it('gets pokemon stats', () => {
        const res: [string, string][] = []
        cy.get(rows).should('be.visible').each((row) => {
            // const cells = row.find('td')
            // const name = Cypress.$(cells[2]).text().trim()

            // const typeElems = Cypress.$(cells[3]).find('a')
            // const types = Array.from(typeElems).map((el) => {
            //     Cypress.$(el).text().trim()
            // })


            const cells = row.find('td');
            const name = Cypress.$(cells[2]).text().trim();
        
            const typeElems = Cypress.$(cells[3]).find('a');
            const types = Array.from(typeElems).map((el) =>
                Cypress.$(el).attr('href')?.match(/([a-zA-Z]+)\.shtml/)
            );

            cy.log(`${name}. ${types.join(' | ')}`)

            // Cypress.$(cells[3]).find('a').each((index, elem) => {
            //     types.push(Cypress.$(elem).text().trim())
            // })

            // res.push([name, types.join(' | ') ])
        }).then(() => {
            // cy.task('writeDataToFile', {data: res, filename: 'pokemon_types'})
        })
    })
})