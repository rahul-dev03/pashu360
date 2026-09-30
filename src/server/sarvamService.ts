import dotenv from 'dotenv';
dotenv.config();

/**
 * Server-side Sarvam AI Multilingual Voice Service
 * Supports Indian languages including Hindi (hi-IN), Marathi (mr-IN), and Indian English (en-IN).
 * API keys are strictly kept server-side and never sent to client.
 */

function getApiKey(): string | undefined {
  const key = process.env.SARVAM_API_KEY?.trim();
  if (key && key !== 'MY_SARVAM_API_KEY' && key !== 'placeholder' && key.length > 5) {
    return key;
  }
  return undefined;
}

export function isSarvamConfigured(): boolean {
  return Boolean(getApiKey());
}

export interface STTOptions {
  audioBuffer?: Buffer;
  audioBase64?: string;
  mimeType?: string;
  languageCode?: string; // 'hi-IN' | 'en-IN' | 'mr-IN' | 'unknown'
  stepContext?: string; // helps fallback infer appropriate farm dialog
  promptHint?: string;
}

export interface STTResult {
  transcript: string;
  languageCode: string;
  confidence?: number;
  isPlaceholder?: boolean;
}

export interface TTSOptions {
  text: string;
  languageCode?: string; // 'hi-IN' | 'en-IN' | 'mr-IN'
  speaker?: string; // 'kavya' | 'aditya' | 'ishita' | 'simran' | 'rahul' | 'rohan'
  pace?: number;
}

export interface TTSResult {
  audioBase64: string;
  mimeType: string;
  isPlaceholder?: boolean;
}

/**
 * Generates a minimal valid WAV audio file buffer in base64.
 * Creates a soft confirmation tone (sine wave) so browser Audio() object can decode and play without errors.
 */
function createPlaceholderWavAudio(frequency = 523.25, durationSeconds = 0.6): string {
  const sampleRate = 16000;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * 2; // 16-bit PCM
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(1, 22); // num channels (1 = mono)
  buffer.writeUInt32LE(sampleRate, 24); // sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate (sampleRate * numChannels * bitsPerSample/8)
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate gentle chime wave
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Envelope: quick attack, smooth exponential decay
    const envelope = Math.exp(-3.5 * (t / durationSeconds));
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.4;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer.toString('base64');
}

/**
 * Normalizes input language to Sarvam supported target language code
 */
function normalizeLanguageCode(code?: string): string {
  if (!code || code === 'unknown') return 'hi-IN';
  if (code.startsWith('mr')) return 'mr-IN';
  if (code.startsWith('en')) return 'en-IN';
  if (code.startsWith('hi') || code.includes('hinglish')) return 'hi-IN';
  return 'hi-IN';
}

/**
 * Server-side Speech to Text (STT)
 * Uses Sarvam saaras:v3 model when SARVAM_API_KEY is configured.
 * Uses intelligent rural dialect fallback when key is unconfigured or unavailable.
 */
export async function speechToText(options: STTOptions): Promise<STTResult> {
  const {
    audioBuffer,
    audioBase64,
    mimeType = 'audio/webm',
    languageCode = 'hi-IN',
    stepContext,
    promptHint,
  } = options;

  let buffer: Buffer | null = null;
  if (audioBuffer) {
    buffer = audioBuffer;
  } else if (audioBase64) {
    const base64Clean = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    buffer = Buffer.from(base64Clean, 'base64');
  }

  const apiKey = getApiKey();
  const targetLang = normalizeLanguageCode(languageCode);

  if (apiKey && buffer && buffer.length > 500) {
    try {
      console.log(`[Sarvam STT] Invoking saaras:v3 API (${buffer.length} bytes, lang: ${targetLang})...`);

      const formData = new FormData();
      const uint8 = new Uint8Array(buffer);
      // Determine appropriate filename extension
      const ext = mimeType.includes('wav') ? 'wav' : mimeType.includes('mp4') ? 'mp4' : 'webm';
      const blob = new Blob([uint8], { type: mimeType });
      formData.append('file', blob, `farmer_voice.${ext}`);
      formData.append('model', 'saaras:v3');
      formData.append('language_code', targetLang);
      if (promptHint) {
        formData.append('prompt', promptHint);
      }

      // 7.5 second timeout to keep UI snappy
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const transcript = data.transcript?.trim();
        console.log('[Sarvam STT] Successfully transcribed:', transcript);

        if (transcript) {
          return {
            transcript,
            languageCode: data.language_code || targetLang,
            confidence: data.confidence ?? 0.96,
            isPlaceholder: false,
          };
        } else {
          console.log('[Sarvam STT] Empty transcript returned from audio, using contextual hint.');
        }
      } else {
        const errText = await response.text();
        console.warn(`[Sarvam STT API Error ${response.status}]: ${errText}. Falling back to graceful conversation.`);
      }
    } catch (err: any) {
      console.warn('[Sarvam STT Network/Timeout Error]:', err.message);
    }
  }

  // Graceful fallback mode if Sarvam is unavailable or audio was silent
  console.log('[Sarvam STT] Using fallback conversation response.');
  let fallbackTranscript = 'Gauri gave 10.2 litres this morning.';

  if (stepContext === 'milk') {
    fallbackTranscript =
      targetLang === 'mr-IN'
        ? 'आज गौरीने १०.२ लिटर दूध दिले, नेहमीपेक्षा २.२ लिटर कमी आहे.'
        : 'आज गौरी ने 10.2 लीटर दूध दिया, सामान्य से लगभग 2.2 लीटर कम हुआ है।';
  } else if (stepContext === 'appetite') {
    fallbackTranscript =
      targetLang === 'mr-IN'
        ? 'चारा कमी खात आहे आणि रवंथ करणेही मंदावले आहे.'
        : 'चारा कम खा रही है और जुगाली भी बहुत धीरे कर रही है।';
  } else if (stepContext === 'temperature') {
    fallbackTranscript =
      targetLang === 'mr-IN'
        ? 'शरीर किंचित गरम जाणवत आहे आणि ती सुस्त बसून आहे.'
        : 'कान का आधार हल्का गर्म लग रहा है, करीब 39.4°C तापमान है और सुस्त बैठी है।';
  } else if (promptHint) {
    fallbackTranscript = promptHint;
  }

  return {
    transcript: fallbackTranscript,
    languageCode: targetLang,
    confidence: 0.92,
    isPlaceholder: true,
  };
}

/**
 * Server-side Text to Speech (TTS)
 * Uses Sarvam bulbul:v3 model when SARVAM_API_KEY is configured.
 * Returns valid playable audio buffer (WAV) and metadata.
 */
export async function textToSpeech(options: TTSOptions): Promise<TTSResult> {
  const { text, languageCode = 'hi-IN', speaker = 'kavya', pace = 0.9 } = options;

  const apiKey = getApiKey();
  const targetLang = normalizeLanguageCode(languageCode);

  // Valid speakers for bulbul:v3 include kavya, aditya, ritu, simran, ishita, rohan, priya, neha, rahul, etc.
  const chosenSpeaker = speaker || (targetLang === 'mr-IN' ? 'ishita' : 'kavya');

  if (apiKey && text?.trim()) {
    try {
      // Strip any extra prompt quotation marks for cleaner speech
      const cleanText = text.replace(/^[“"']+|[”"']+$/g, '').trim();

      console.log(`[Sarvam TTS] Invoking bulbul:v3 API for: "${cleanText.substring(0, 45)}..." (${targetLang}, speaker: ${chosenSpeaker})...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        body: JSON.stringify({
          inputs: [cleanText],
          target_language_code: targetLang,
          speaker: chosenSpeaker,
          pitch: 0,
          pace: pace || 1.0,
          loudness: 1.5,
          speech_sample_rate: 16000,
          enable_preprocessing: true,
          model: 'bulbul:v3',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.audios && data.audios.length > 0 && data.audios[0].length > 100) {
          console.log(`[Sarvam TTS] Success! Audio generated (${data.audios[0].length} chars base64).`);
          return {
            audioBase64: data.audios[0],
            mimeType: 'audio/wav',
            isPlaceholder: false,
          };
        }
      } else {
        const errText = await response.text();
        console.warn(`[Sarvam TTS API Error ${response.status}]: ${errText}. Falling back to audible placeholder.`);
      }
    } catch (err: any) {
      console.warn('[Sarvam TTS Network/Timeout Error]:', err.message);
    }
  }

  // Graceful fallback audio tone
  console.log('[Sarvam TTS] Using fallback audible tone.');
  const placeholderWav = createPlaceholderWavAudio(523.25, 0.6);

  return {
    audioBase64: placeholderWav,
    mimeType: 'audio/wav',
    isPlaceholder: true,
  };
}

export function getSarvamStatus() {
  const configured = isSarvamConfigured();
  return {
    isConfigured: configured,
    provider: 'Sarvam AI',
    models: {
      stt: 'saaras:v3',
      tts: 'bulbul:v3',
    },
    supportedLanguages: ['hi-IN', 'en-IN', 'mr-IN'],
  };
}
