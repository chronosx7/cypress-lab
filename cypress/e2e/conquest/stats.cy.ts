Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

describe('retrieves pokemon stats', () => {
    beforeEach(() => {
        cy.visit('https://www.serebii.net/conquest/pokemon.shtml')
    })
    it('gets pokemon stats', () => {
        const res: [string, string][] = []
        let csv_res: string = ""
        cy.get('table.tab > tbody > tr').should('be.visible').each((row) => {
            const cells = row.children('td');
            const name = Cypress.$(cells[2]).find('a').text().trim();
        
            const typeElems = Cypress.$(cells[3]).find('a');
            const types = Array.from(typeElems).map((el) =>
                Cypress.$(el).attr('href')?.match(/[a-zA-Z]+(?=\.shtml)/)
            );

            if(name !== '') {
                res.push([name, types.join(' | ') ])
                csv_res += [name, types.join(' | ') ].join(',') + ",\n"
            }
        }).then(() => {
            cy.task('writeDataToFile', {data: res, filename: 'pokemon_types.json'})
            cy.task('writeDataToFile', {data: csv_res, filename: 'pokemon_types.csv'})
            cy.log("Files created")
        })
    })
})