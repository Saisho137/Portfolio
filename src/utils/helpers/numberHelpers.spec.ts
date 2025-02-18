import { transformToNumber } from './numberHelpers';

describe('transformToNumber', () => {
  it('should transform a numeric string to a number', () => {
    expect(transformToNumber('123')).toBe(123);
  });

  it('should transform a string with decimal to a number', () => {
    expect(transformToNumber('123.45')).toBe(123.45);
  });

  it('should return NaN for non-numeric string', () => {
    expect(transformToNumber('abc')).toBeNaN();
  });

  it('should return NaN for empty string', () => {
    expect(transformToNumber('')).toBe(0);
  });

  it('should transform a string with leading and trailing spaces to a number', () => {
    expect(transformToNumber('  123  ')).toBe(123);
  });

  it('should transform a string with leading zeros to a number', () => {
    expect(transformToNumber('00123')).toBe(123);
  });
});
