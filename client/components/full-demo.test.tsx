import { render, screen, fireEvent } from '@testing-library/react';
import { FullDemo } from './full-demo';

describe('FullDemo', () => {
  it('renders the chat interface', () => {
    render(<FullDemo initialMessage="Hello" />);
    
    expect(screen.getByText('ChatGenius')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByText('Participants')).toBeInTheDocument();
  });

  it('should have proper Tailwind classes', () => {
    render(<FullDemo initialMessage="Hello" />);
    
    // Test container classes
    expect(screen.getByTestId('chat-container')).toHaveClass('w-full', 'max-w-4xl', 'h-[600px]', 'flex');
    
    // Test message input classes
    expect(screen.getByPlaceholderText('Type your message...')).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'flex-grow'
    );
  });

  it('should handle message input', () => {
    render(<FullDemo initialMessage="Hello" />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    expect(input).toHaveValue('Test message');
  });

  it('should show initial message and AI response', () => {
    render(<FullDemo initialMessage="Hello" />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to ChatGenius/)).toBeInTheDocument();
  });
}); 