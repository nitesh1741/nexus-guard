import { GoogleGenerativeAI } from '@google/generative-ai';
import { TriageReport } from '@/types/triage';

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function processTriageData(image: string, text: string): Promise<TriageReport> {
  if (!image && !text) {
    throw new Error('Image or text notes are required.');
  }

  // Prepare image for Gemini (extract base64 and mime pattern from Data URL) if image exists
  const base64Data = image ? (image.includes(',') ? image.split(',')[1] : image) : '';
  const mimeType = image ? (image.includes(';') ? image.split(';')[0].split(':')[1] : 'image/jpeg') : '';

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  // EXACT strict system prompt as requested for Universal Decision Engine
  const systemPrompt = `You are an elite AI Universal Decision Engine, acting as an emergency responder, medical guide, and personal assistant. 
Analyze the provided image and/or text input. Convert chaos into a structured JSON payload.
Output STRICTLY in this JSON format with NO markdown formatting:
{
  "intent": "'emergency' or 'informational' or 'actionable'",
  "urgency_score": [1-10 integer],
  "incident_type": "[short 2-4 word classification]",
  "detected_location": "[Extract any location mentioned, or 'Unknown']",
  "confidence_score": [0-100 integer],
  "extracted_vitals": [array of strings tracking vitals/symptoms],
  "medical_flags": [array of strings for critical warnings],
  "immediate_action": "[One definitive instruction for the user]",
  "dispatch_code": "[e.g., Code Red, Info-Query, Assist]",
  "suggested_actions": [ 
    array of objects: { "label": "e.g. Call Ambulance", "type": "call|navigate|info|action", "value": "e.g. 911" }
  ],
  "trust_sources": [array of strings like 'Google Maps estimation', 'Verified Hospital DB', 'Standard First Aid Rules']
}`;

  const promptText = `${systemPrompt}\n\nMessy notes/context:\n${text}`;

  // Conditionally add imagePart if an image was provided
  const parts: any[] = [promptText];
  if (base64Data) {
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  const result = await model.generateContent(parts);
  const response = await result.response;
  const responseText = response.text();

  try {
    let cleanText = responseText;
    // Strip markdown code blocks if the AI accidentally included them
    if (cleanText.includes('\`\`\`')) {
       cleanText = cleanText.replace(/\`\`\`json\n?|\n?\`\`\`/g, '').trim();
    }
    const jsonResponse = JSON.parse(cleanText);
    return jsonResponse as TriageReport;
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON:', responseText, err);
    throw new Error('Failed to generate a valid JSON report. AI output was: ' + responseText.substring(0, 100) + '...');
  }
}
