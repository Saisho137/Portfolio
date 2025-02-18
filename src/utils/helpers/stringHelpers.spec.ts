import { transformToCapital, transformToLowerCase } from './stringHelpers';

describe('stringHelpers', () => {
  describe('transformToCapital', () => {
    it('should transform text to uppercase', () => {
      expect(transformToCapital('hello')).toBe('HELLO');
    });

    it('should handle empty strings', () => {
      expect(transformToCapital('')).toBe('');
    });

    it('should handle already uppercase strings', () => {
      expect(transformToCapital('HELLO')).toBe('HELLO');
    });

    it('should handle mixed case strings', () => {
      expect(transformToCapital('HeLLo')).toBe('HELLO');
    });
  });

  describe('transformToLowerCase', () => {
    it('should transform text to lowercase', () => {
      expect(transformToLowerCase('HELLO')).toBe('hello');
    });

    it('should handle empty strings', () => {
      expect(transformToLowerCase('')).toBe('');
    });

    it('should handle already lowercase strings', () => {
      expect(transformToLowerCase('hello')).toBe('hello');
    });

    it('should handle mixed case strings', () => {
      expect(transformToLowerCase('HeLLo')).toBe('hello');
    });
  });
});
