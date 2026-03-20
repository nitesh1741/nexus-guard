import { GoogleGenerativeAI } from '@google/generative-ai';
import { TriageReport } from '@/types/triage';

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function processTriageData(image: string, text: string): Promise<TriageReport> {
  if (!image || !text) {
    throw new Error('Image and text notes are required.');
  }

  // Prepare image for Gemini (extract base64 and mime pattern from Data URL)
  const base64Data = image.includes(',') ? image.split(',')[1] : image;
  const mimeType = image.includes(';') ? image.split(';')[0].split(':')[1] : 'image/jpeg';

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  // EXACT strict system prompt as requested
  const systemPrompt = `You are an elite emergency medical dispatcher AI. Analyze the provided image and messy notes. Convert them instantly into a structured JSON payload for hospitals. Output strictly in this JSON format with no markdown formatting or extra text: { "urgency_score": [1-10 integer], "incident_type": "[3-word classification]", "extracted_vitals": [array of strings], "medical_flags": [array of strings], "immediate_action": "[One clear instruction]", "dispatch_code": "[e.g., Code Red]" }`;

  const promptText = `${systemPrompt}\n\nMessy notes/context:\n${text}`;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const result = await model.generateContent([promptText, imagePart]);
  const response = await result.response;
  const responseText = response.text();

  try {
    const jsonResponse = JSON.parse(responseText.replace(/```json\n?|\n?```/g, '').trim());
    return jsonResponse as TriageReport;
  } catch {
    console.error('Failed to parse Gemini response as JSON:', responseText);
    throw new Error('Failed to generate a valid JSON report.');
  }
}
