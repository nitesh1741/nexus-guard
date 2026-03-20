# NexusGuard: Universal Decision Engine

NexusGuard is an AI-powered Universal Decision Engine that converts messy real-world inputs into trusted, actionable steps in seconds. Think of it as **ChatGPT + Google Maps + Emergency OS + Personal Assistant**.

## 🎯 Chosen Vertical
**Emergency Response, Medical Triage & Personal Crisis Management**  
NexusGuard operates in the critical path of emergency response. During an emergency, individuals are often panicked, inputs are messy (frantic voice notes, blurred photos, unstructured text), and time is of the essence. NexusGuard acts as a "Guardian AI", instantly prioritizing chaos into actionable, verified, and structured outcomes.

## 🧠 Approach and Logic
We approached this problem by separating the platform into a 5-stage pipeline:
1. **Universal Input Layer**: A zero-friction "Command Center" where users can drop anything—images of an accident, frantic text, or voice commands—without filling out rigid forms.
2. **Context Engine**: Leveraging **Google Gemini 1.5 Flash (Multimodal)**, the app converts unstructured multimodal data into a strictly defined JSON payload. It extracts intent, location, vitals, medical flags, and urgency score.
3. **Action Engine**: Instead of forcing the user to read a wall of text, the engine maps the AI’s conclusions directly to massive, color-coded, one-tap UI buttons (e.g., "Call Ambulance", "View First Aid").
4. **Verification Layer**: To prevent AI hallucinations, the system visually separates "Detected Context" from verifiable structured data, generating a transparent Confidence Score.
5. **Personal AI Layer**: A living dashboard that tracks the user's health profile (allergies, blood type) and leverages history to offer proactive situational alerts.

## 🛠️ How the Solution Works
1. **Input**: A user submits a photo (e.g., a physical injury) alongside a messy text note like *"Accident near MG road, bleeding heavily"*.
2. **Processing**: The Next.js API route (`/api/triage`) securely pipes the image and text to the Gemini API utilizing a highly restrictive, JSON-enforced system prompt.
3. **Structuring**: Gemini returns a structured JSON object containing: 
   - `intent`: (emergency, informational, actionable)
   - `urgency_score`: (1-10 stringency)
   - `dispatch_code` & array of `suggested_actions`
4. **Rendering**: The `ActionScreen` component consumes this JSON, dynamically matches the UI theme (Red for emergencies, Blue for info), and presents the user with immediate, tap-to-execute real-world actions.

## ⚠️ Assumptions Made
1. **API Availability**: Assumes stable connectivity to the Gemini API for the MVP. In a production environment, an offline-first fallback (e.g., local cached first-aid steps) would be required to ensure reliability in dead zones.
2. **Location Tracking**: Currently, the AI infers the location directly from the user's text input. In a production deployment, this would be supplemented by the device's exact GPS coordinates via the HTML5 `navigator.geolocation` API to ensure accurate dispatch routing.
3. **Mocked Peripherals**: The microphone and document upload buttons in the UI are currently mocked to demonstrate the "Universal Input" MVP aesthetic. In production, these would trigger native device APIs and standard Speech-to-Text models (like Whisper).

---

## Getting Started

First, install dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You will need a `.env.local` file with your `GEMINI_API_KEY`.
