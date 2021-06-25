describe('BlogList App', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'root',
      username: 'root',
      password: 'secret'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Blog List App')
    cy.contains('Login in to application')
  })

  describe('Login', function () {
    it('login fails with wrong credentials', function () {
      cy.get('[name="Username"]').type('mluukkai')
      cy.get('[name="Password"]').type('wrong')
      cy.get('#login-form-btn').click()

      cy.get('html').should('contain', 'Wrong credentials')
      cy.get('html').should('not.contain', 'root logged-in')
    })

    it('login sucess with correct credentials', function () {
      cy.get('[name="Username"]').type('root')
      cy.get('[name="Password"]').type('secret')
      cy.get('#login-form-btn').click()

      cy.get('html').should('not.contain', 'root logged-in')
    })

    describe('when logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'root', password: 'secret' })
      })

      it('a new blog can be created', function () {
        cy.contains('create a new blog').click()

        cy.get('#title').type('new title created by cypress')
        cy.get('#author').type('new author created by cypress')
        cy.get('#url').type('new url created by cypress')

        cy.get('#blog-form-btn-create').click()

        cy.contains('new title created by cypress')
        cy.contains('new author created by cypress')
      })

      describe('and severals blogs exist', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'title1',
            author: 'author1',
            url: 'url1'
          })
          cy.createBlog({
            title: 'title2',
            author: 'author2',
            url: 'url2'
          })
          cy.createBlog({
            title: 'title3',
            author: 'author3',
            url: 'url3'
          })
        })

        it('a user can like a blog', function () {
          cy.get('#blog').contains('view').click()
          cy.get('#likes').should('contain', '0')
          cy.contains('title1').parent().find('#like-btn').as('view-btn')
          cy.get('@view-btn').click()
          cy.get('#likes').should('contain', '1')
        })

        it('a user can be delete a blog', function () {
          cy.get('#blog').contains('view').click()
          cy.contains('title1').parent().find('#delete-btn').as('delete-btn')
          cy.get('@delete-btn').click()
          cy.get('html').should('not.contain', 'title1')
        })
      })
    })
  })
})
