/// <reference types="cypress" />

describe('Smoke Test', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('Welcome to ChatGenius').should('be.visible');
  });

  it('should have basic chat interface elements', () => {
    cy.visit('/');
    cy.get('input[placeholder="Type your message..."]').should('be.visible');
    cy.contains('Try ChatGenius').should('be.visible');
  });

  it('should show full chat interface after sending a message', () => {
    cy.visit('/');
    cy.get('input[placeholder="Type your message..."]').type('Hello');
    cy.contains('button', 'Send').click();

    // Wait for the full demo to appear
    cy.get('[data-testid="chat-container"]', { timeout: 5000 }).should('be.visible');

    // Check for welcome message
    cy.contains("Welcome to ChatGenius! I'm your AI assistant").should('be.visible');

    // Check for participants section on larger screens
    cy.viewport(1024, 768); // Set viewport to desktop size
    cy.contains('Participants').should('be.visible');
  });
});
