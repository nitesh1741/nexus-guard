import { renderHook, act } from '@testing-library/react';
import { useTriage } from './useTriage';

global.fetch = jest.fn(); // Mock global fetch

describe('useTriage Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() => useTriage());
    expect(result.current.loading).toBe(false);
    expect(result.current.report).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should set an error if generating report without an image', async () => {
    const { result } = renderHook(() => useTriage());
    
    await act(async () => {
      await result.current.generateReport();
    });
    
    expect(result.current.error).toBe("Please upload an accident photo.");
  });

  it('should set an error if generating report without notes', async () => {
    const { result } = renderHook(() => useTriage());
    
    act(() => {
      result.current.setImage('data:image/jpeg;base64,12345');
    });

    await act(async () => {
      await result.current.generateReport();
    });
    
    expect(result.current.error).toBe("Please provide emergency notes or context.");
  });
});
