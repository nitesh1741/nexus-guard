import { renderHook, act } from '@testing-library/react';
import { useTriage } from './useTriage';

// Mock firebase firestoreHistory module so tests don't need a real Firebase project
jest.mock('@/lib/firestoreHistory', () => ({
  saveTriageToHistory: jest.fn().mockResolvedValue('mock-doc-id'),
}));

global.fetch = jest.fn();

const mockReport = {
  intent: 'emergency' as const,
  urgency_score: 9,
  incident_type: 'Cardiac Arrest',
  detected_location: 'Main Street',
  confidence_score: 90,
  extracted_vitals: ['No pulse', 'Unresponsive'],
  medical_flags: ['Possible cardiac arrest'],
  immediate_action: 'Begin CPR immediately',
  dispatch_code: 'Code Red',
  suggested_actions: [{ label: 'Call 911', type: 'call' as const, value: '911' }],
  trust_sources: ['Standard First Aid Rules'],
};

describe('useTriage Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default states', () => {
    const { result } = renderHook(() => useTriage());
    expect(result.current.loading).toBe(false);
    expect(result.current.report).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.phase).toBe('idle');
    expect(result.current.image).toBeNull();
    expect(result.current.notes).toBe('');
  });

  it('should set an error when generating report with no image or notes', async () => {
    const { result } = renderHook(() => useTriage());

    await act(async () => {
      await result.current.generateReport();
    });

    expect(result.current.error).toBe('Please provide at least an image or some text context.');
    expect(result.current.phase).toBe('idle');
  });

  it('should transition phase to analyzing then complete on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    });

    const { result } = renderHook(() => useTriage());

    act(() => {
      result.current.setNotes('Patient is unconscious at 123 Main St');
    });

    await act(async () => {
      await result.current.generateReport();
    });

    expect(result.current.phase).toBe('complete');
    expect(result.current.report).toEqual(mockReport);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should set error and return to idle phase on API failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Internal server error' }),
    });

    const { result } = renderHook(() => useTriage());

    act(() => {
      result.current.setNotes('Some emergency situation');
    });

    await act(async () => {
      await result.current.generateReport();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.error).toBe('Internal server error');
    expect(result.current.report).toBeNull();
  });

  it('should reset all state to defaults', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    });

    const { result } = renderHook(() => useTriage());

    act(() => { result.current.setNotes('Emergency at hospital'); });
    await act(async () => { await result.current.generateReport(); });
    expect(result.current.phase).toBe('complete');

    act(() => { result.current.reset(); });

    expect(result.current.image).toBeNull();
    expect(result.current.notes).toBe('');
    expect(result.current.report).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.phase).toBe('idle');
    expect(result.current.loading).toBe(false);
  });

  it('should handle network error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTriage());

    act(() => { result.current.setImage('data:image/jpeg;base64,abc123'); });
    await act(async () => { await result.current.generateReport(); });

    expect(result.current.phase).toBe('idle');
    expect(result.current.error).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('should work with only an image (no notes)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    });

    const { result } = renderHook(() => useTriage());

    act(() => { result.current.setImage('data:image/jpeg;base64,abc123'); });
    await act(async () => { await result.current.generateReport(); });

    expect(result.current.phase).toBe('complete');
    expect(result.current.error).toBeNull();
  });
});
