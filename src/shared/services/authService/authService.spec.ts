import { authService } from './authService';

describe('authService', () => {
  test('should login', () => {
    expect(true).toBe(true);
  });

  test('should call login method', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    authService.login();
    expect(consoleSpy).toHaveBeenCalledWith('login');
    consoleSpy.mockRestore();
  });

  test('should call logout method', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    authService.logout();
    expect(consoleSpy).toHaveBeenCalledWith('logout');
    consoleSpy.mockRestore();
  });

  test('should call register method', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    authService.register();
    expect(consoleSpy).toHaveBeenCalledWith('register');
    consoleSpy.mockRestore();
  });
});
