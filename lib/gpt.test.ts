import { askGPT, GPTError } from './gpt';

global.fetch = jest.fn();

describe('askGPT', () => {
  it('should return the content of the message on a successful API call', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Hello, world!' } }] }),
    });

    const result = await askGPT('Hello');
    expect(result).toBe('Hello, world!');
  });

  it('should throw a GPTError on a failed API call', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } }),
    });

    await expect(askGPT('Hello')).rejects.toThrow(new GPTError('OpenAI API Error: Invalid API key'));
  });

  it('should throw a GPTError on a network error', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(askGPT('Hello')).rejects.toThrow(new GPTError('An unexpected error occurred while communicating with the OpenAI API.'));
  });
});
