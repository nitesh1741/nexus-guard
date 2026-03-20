import { processTriageData } from './triageService';

// Mock the Gemini SDK to control responses in tests
jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn();
  const mockGetGenerativeModel = jest.fn(() => ({
    generateContent: mockGenerateContent,
  }));
  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    })),
    Part: {},
  };
});

const { GoogleGenerativeAI } = jest.requireMock('@google/generative-ai');

const mockValidReport = {
  intent: 'emergency',
  urgency_score: 8,
  incident_type: 'Road Accident',
  detected_location: 'Highway 101',
  confidence_score: 85,
  extracted_vitals: ['Bleeding'],
  medical_flags: ['Head trauma possible'],
  immediate_action: 'Call 911 immediately',
  dispatch_code: 'Code Red',
  suggested_actions: [{ label: 'Call 911', type: 'call', value: '911' }],
  trust_sources: ['Standard First Aid Rules'],
};

function getMockModel() {
  const instance = new GoogleGenerativeAI('test-key');
  return instance.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

describe('processTriageData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when both image and text are empty', async () => {
    await expect(processTriageData('', '')).rejects.toThrow(
      'Image or text notes are required.'
    );
  });

  it('should call Gemini and return a parsed TriageReport for text input', async () => {
    const model = getMockModel();
    (model.generateContent as jest.Mock).mockResolvedValueOnce({
      response: { text: () => JSON.stringify(mockValidReport) },
    });

    const result = await processTriageData('', 'Patient unconscious on Highway 101');
    expect(result).toEqual(mockValidReport);
    expect(result.urgency_score).toBe(8);
  });

  it('should strip markdown code fences from AI response', async () => {
    const model = getMockModel();
    const wrappedJson = '```json\n' + JSON.stringify(mockValidReport) + '\n```';
    (model.generateContent as jest.Mock).mockResolvedValueOnce({
      response: { text: () => wrappedJson },
    });

    const result = await processTriageData('', 'Some emergency');
    expect(result.intent).toBe('emergency');
  });

  it('should throw a descriptive error when AI returns invalid JSON', async () => {
    const model = getMockModel();
    (model.generateContent as jest.Mock).mockResolvedValueOnce({
      response: { text: () => 'This is not valid JSON at all' },
    });

    await expect(processTriageData('', 'emergency')).rejects.toThrow(
      'Failed to generate a valid JSON report.'
    );
  });

  it('should truncate text input to MAX_TEXT_LENGTH (5000 chars)', async () => {
    const model = getMockModel();
    (model.generateContent as jest.Mock).mockResolvedValueOnce({
      response: { text: () => JSON.stringify(mockValidReport) },
    });

    const longText = 'A'.repeat(10000);
    await processTriageData('', longText);

    const callArgs = (model.generateContent as jest.Mock).mock.calls[0][0];
    const textPart = callArgs[0].text as string;
    // The text part should contain at most MAX_TEXT_LENGTH characters of the input
    expect(textPart.includes('A'.repeat(5001))).toBe(false);
  });

  it('should include image part when a base64 image is provided', async () => {
    const model = getMockModel();
    (model.generateContent as jest.Mock).mockResolvedValueOnce({
      response: { text: () => JSON.stringify(mockValidReport) },
    });

    const fakeImage = 'data:image/jpeg;base64,abc123xyz';
    await processTriageData(fakeImage, 'notes about the accident');

    const callArgs = (model.generateContent as jest.Mock).mock.calls[0][0];
    expect(callArgs).toHaveLength(2); // text part + inlineData part
    expect(callArgs[1].inlineData.mimeType).toBe('image/jpeg');
    expect(callArgs[1].inlineData.data).toBe('abc123xyz');
  });
});
