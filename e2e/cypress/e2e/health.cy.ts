describe('Health Check', () => {
  it('should verify server health', () => {
    cy.request('http://localhost:3001/api/health').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status', 'healthy');
      expect(response.body).to.have.property('database');
      expect(response.body.database).to.have.property('success', true);
    });
  });

  it('should load the client application', () => {
    cy.visit('/');
    cy.contains('ChatGenius');
  });
}); 