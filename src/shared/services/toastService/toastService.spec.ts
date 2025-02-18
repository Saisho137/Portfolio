import { toastService } from './toastService';

describe('toastService', () => {
  it('should show success toast', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    toastService.showSuccess('Success message');
    expect(consoleSpy).toHaveBeenCalledWith('showSuccess', 'Success message');
    consoleSpy.mockRestore();
  });

  it('should show error toast', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    toastService.showError('Error message');
    expect(consoleSpy).toHaveBeenCalledWith('showError', 'Error message');
    consoleSpy.mockRestore();
  });
});
