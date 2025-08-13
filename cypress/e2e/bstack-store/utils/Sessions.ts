export function api_sign_in_test_user(username: string): void {
    cy.session(`${username}-session`,() => {
        cy.fixture('test_users').then((data) => {
            const user = data.users[username]
            cy.request({
                method: 'POST',
                url: 'https://www.bstackdemo.com/api/signin',
                body: {
                    userName: user.userName,
                    password: user.password
                }
            }).then(() => {
                cy.window().then((win) => {
                    win.sessionStorage.setItem('username', user.userName)
                })
            })
        })
    
    })
}
