/// <reference types="cypress" />

describe('Smoke Test', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('ChatGenius').should('be.visible');
  });

  it('should have basic chat interface elements', () => {
    cy.visit('/');
    cy.get('input[placeholder="Type your message..."]').should('be.visible');
    cy.contains('Participants').should('be.visible');
    cy.contains('AI Assistant').should('be.visible');
  });

  it('should show welcome message', () => {
    cy.visit('/');
    cy.contains("Welcome to ChatGenius! I'm your AI assistant").should('be.visible');
  });
}); 