describe('Chat Application', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // Send initial message to show full chat interface
    cy.get('form')
      .first()
      .within(() => {
        cy.get('input[placeholder="Type your message..."]').type('Hello');
        cy.get('button[type="submit"]').click();
      });
  });

  it('should load the chat interface', () => {
    cy.get('[data-testid=chat-container]').should('be.visible');
    cy.contains('ChatGenius').should('be.visible');
    cy.contains('AI Assistant').should('be.visible');
  });

  it('should send and receive messages', () => {
    const testMessage = 'Hello, this is a test message';

    // Type and send a message in the full chat interface
    cy.get('[data-testid=chat-container]').within(() => {
      cy.get('input[placeholder="Type your message..."]').type(testMessage);
      cy.get('button[type="submit"][aria-label="Send message"]').click();

      // Verify message appears in chat
      cy.contains(testMessage).should('be.visible');

      // Wait for AI response
      cy.contains('AI Assistant').should('be.visible');
    });
  });

  it('should show participants', () => {
    // Wait for the participants section to be visible (it's hidden on mobile)
    cy.get('.md\\:flex').within(() => {
      cy.contains('Participants').should('be.visible');
      cy.contains('AI Assistant').should('be.visible');
      cy.contains(/Guest\d+/).should('be.visible');
    });
  });

  it('should handle empty messages', () => {
    // Try to send empty message in the full chat interface
    cy.get('[data-testid=chat-container]').within(() => {
      cy.get('button[type="submit"][aria-label="Send message"]').click();

      // Get current message count
      cy.get('p').then(($messages) => {
        const initialCount = $messages.length;
        // Try to send another empty message
        cy.get('button[type="submit"][aria-label="Send message"]').click();
        // Verify no new messages were added
        cy.get('p').should('have.length', initialCount);
      });
    });
  });
});
