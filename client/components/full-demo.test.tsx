import { render, screen, fireEvent } from '@testing-library/react';
import { FullDemo } from './full-demo';

describe('FullDemo', () => {
  it('renders the chat interface', () => {
    render(<FullDemo initialMessage="Hello" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should have proper Tailwind classes', () => {
    render(<FullDemo initialMessage="Hello" />);

    // Test message input classes
    expect(screen.getByPlaceholderText('Type your message...')).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-transparent',
      'px-3',
      'py-1',
      'text-base',
      'shadow-sm',
      'transition-colors',
      'grow',
    );
  });

  it('should handle message input', () => {
    render(<FullDemo initialMessage="Hello" />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input).toHaveValue('Hello');
  });

  it('should show initial message and AI response', () => {
    render(<FullDemo initialMessage="Hello" />);
    expect(screen.getByText(/Welcome to ChatGenius/i)).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
