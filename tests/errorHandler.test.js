import { errorHandler } from '../src/lib/errorHandler.js';

describe('errorHandler localization', () => {
  let originalResolver;

  beforeEach(() => {
    originalResolver = errorHandler.languageResolver;
  });

  afterEach(() => {
    if (typeof originalResolver === 'function') {
      errorHandler.setLanguageResolver(originalResolver);
    }
  });

  it('returns Arabic messages when language is set to ar', () => {
    const error = new Error('Unknown error');
    error.code = 'auth/user-not-found';

    const result = errorHandler.handleError(error, 'test:arabic', 'ar');

    expect(result.message).toBe('البريد الإلكتروني غير مسجل');
    expect(result.language).toBe('ar');
  });

  it('returns English messages when language is set to en', () => {
    const error = new Error('Unknown error');
    error.code = 'auth/user-not-found';

    const result = errorHandler.handleError(error, 'test:english', 'en');

    expect(result.message).toBe('Email not registered');
    expect(result.language).toBe('en');
  });

  it('uses the resolver when language is not provided', () => {
    const error = new Error('Unknown error');
    error.code = 'auth/wrong-password';

    errorHandler.setLanguageResolver(() => 'en');

    const result = errorHandler.handleError(error, 'test:resolver');

    expect(result.message).toBe('Incorrect password');
    expect(result.language).toBe('en');
  });
});
