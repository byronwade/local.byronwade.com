import React from 'react'
import BusinessAddress from './business-address'

describe('<BusinessAddress />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<BusinessAddress />)
  })
})
