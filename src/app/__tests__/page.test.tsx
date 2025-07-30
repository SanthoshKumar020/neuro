import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ script: 'This is a test script.' }),
  })
) as jest.Mock;

describe('Home component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    (fetch as jest.Mock).mockClear();
  });

  it('renders the main heading and form elements', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /neura - ai video creation/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/video topic/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate script/i })).toBeInTheDocument();
  });

  it('disables the button when the topic is empty', () => {
    render(<Home />);
    const button = screen.getByRole('button', { name: /generate script/i });
    expect(button).toBeDisabled();
  });

  it('enables the button when the topic is not empty', () => {
    render(<Home />);
    const textarea = screen.getByLabelText(/video topic/i);
    fireEvent.change(textarea, { target: { value: 'A story about a cat' } });
    const button = screen.getByRole('button', { name: /generate script/i });
    expect(button).toBeEnabled();
  });

  it('calls the API and displays the script on form submission', async () => {
    render(<Home />);

    const textarea = screen.getByLabelText(/video topic/i);
    fireEvent.change(textarea, { target: { value: 'A story about a dog' } });

    const button = screen.getByRole('button', { name: /generate script/i });
    fireEvent.click(button);

    // Check for loading state
    expect(screen.getByRole('button', { name: /generating script\.\.\./i })).toBeInTheDocument();

    // Wait for the API call to resolve and the script to be displayed
    await waitFor(() => {
      expect(screen.getByText('This is a test script.')).toBeInTheDocument();
    });

    // Check if fetch was called correctly
    expect(fetch).toHaveBeenCalledWith('/api/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: 'A story about a dog' }),
    });

    // Check that the loading state is gone
    expect(screen.getByRole('button', { name: /generate script/i })).toBeInTheDocument();
  });

  it('displays an error message if the API call fails', async () => {
    // Mock a failed fetch call
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<Home />);

    const textarea = screen.getByLabelText(/video topic/i);
    fireEvent.change(textarea, { target: { value: 'A failed story' } });

    const button = screen.getByRole('button', { name: /generate script/i });
    fireEvent.click(button);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Sorry, something went wrong. Please try again.')).toBeInTheDocument();
    });
  });
});
