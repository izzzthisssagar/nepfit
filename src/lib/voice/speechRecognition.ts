/**
 * Web Speech API Integration for NepFit Voice Logging
 *
 * This module provides real voice recognition capabilities
 * using the browser's Web Speech API.
 */

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface ParsedFoodEntry {
  name: string;
  grams: number;
  quantity: number;
  rawTranscript: string;
  confidence: number;
}

export interface VoiceRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean, confidence: number) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

/**
 * Check if Web Speech API is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Create a speech recognition instance
 */
export function createSpeechRecognition(): SpeechRecognition | null {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionAPI();

  // Configure recognition
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US'; // Can be changed to 'ne-NP' for Nepali
  recognition.maxAlternatives = 3;

  return recognition;
}

/**
 * Voice recognition service class
 */
export class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private callbacks: VoiceRecognitionCallbacks = {};

  constructor() {
    this.recognition = createSpeechRecognition();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;
      const confidence = lastResult[0].confidence;
      const isFinal = lastResult.isFinal;

      this.callbacks.onResult?.(transcript, isFinal, confidence);
    };

    this.recognition.onerror = (event: Event & { error: string }) => {
      let errorMessage = 'Speech recognition error';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not found. Please check your device.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition aborted.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      this.callbacks.onError?.(errorMessage);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
    };
  }

  /**
   * Start listening for speech
   */
  start(callbacks: VoiceRecognitionCallbacks): boolean {
    if (!this.recognition) {
      callbacks.onError?.('Speech recognition not supported in this browser.');
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    this.callbacks = callbacks;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      callbacks.onError?.('Failed to start speech recognition.');
      return false;
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if supported
   */
  isSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Change language
   */
  setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}

/**
 * Parse food entry from voice transcript
 * Supports patterns like:
 * - "200 grams of rice"
 * - "I had 150g chicken"
 * - "one bowl of dal"
 * - "two rotis"
 * - "250 gram rice"
 */
export function parseFoodFromTranscript(transcript: string): ParsedFoodEntry | null {
  const lower = transcript.toLowerCase().trim();

  // Common food quantity patterns
  const patterns = [
    // "200 grams of rice" or "200g rice"
    /(\d+)\s*(g|grams?|gram)\s*(?:of\s+)?(.+)/i,
    // "one/two/three bowl of dal"
    /(one|two|three|four|five|1|2|3|4|5)\s*(bowl|plate|cup|piece|serving|roti|chapati)s?\s*(?:of\s+)?(.+)?/i,
    // "had/ate 150g chicken"
    /(?:had|ate|eaten|i had|i ate)\s*(\d+)\s*(g|grams?)\s*(?:of\s+)?(.+)/i,
    // "chicken 250 grams"
    /^(.+?)\s+(\d+)\s*(g|grams?|gram)$/i,
    // Basic food name detection
    /(?:had|ate|eaten)?\s*(?:a|an|some)?\s*(.+)/i,
  ];

  // Number word to digit mapping
  const numberWords: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  };

  // Common portion sizes
  const portionSizes: Record<string, number> = {
    bowl: 200,
    plate: 300,
    cup: 150,
    piece: 50,
    serving: 150,
    roti: 40,
    chapati: 40,
    glass: 200,
    spoon: 15,
    tablespoon: 15,
    teaspoon: 5,
  };

  // Try patterns in order
  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match) {
      let grams = 100; // Default
      let quantity = 1;
      let foodName = '';

      // Pattern 1: "200 grams of rice"
      if (match[3] && /^\d+$/.test(match[1])) {
        grams = parseInt(match[1]);
        foodName = match[3].trim();
      }
      // Pattern 2: "one bowl of dal"
      else if (numberWords[match[1]] || /^\d+$/.test(match[1])) {
        quantity = numberWords[match[1]] || parseInt(match[1]);
        const portion = match[2]?.toLowerCase();
        if (portion && portionSizes[portion]) {
          grams = portionSizes[portion] * quantity;
        }
        foodName = match[3]?.trim() || match[2];
      }
      // Pattern with food name first: "chicken 250 grams"
      else if (match[2] && /^\d+$/.test(match[2])) {
        foodName = match[1].trim();
        grams = parseInt(match[2]);
      }
      // Basic food name
      else {
        foodName = match[1]?.trim() || transcript.trim();
      }

      // Clean up food name
      foodName = foodName
        .replace(/^(had|ate|eaten|i |some |a |an )/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (foodName.length > 0) {
        return {
          name: capitalizeWords(foodName),
          grams: Math.max(10, Math.min(2000, grams)), // Clamp between 10-2000g
          quantity,
          rawTranscript: transcript,
          confidence: 0.8,
        };
      }
    }
  }

  return null;
}

/**
 * Capitalize first letter of each word
 */
function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Estimate calories from food name (basic heuristic)
 * In production, this would call a nutrition API
 */
export function estimateCaloriesFromName(foodName: string, grams: number): number {
  const lower = foodName.toLowerCase();

  // Calorie estimates per 100g for common foods
  const calorieEstimates: Record<string, number> = {
    rice: 130,
    'steamed rice': 130,
    'white rice': 130,
    dal: 120,
    'dal bhat': 130,
    roti: 250,
    chapati: 250,
    chicken: 165,
    'chicken curry': 150,
    momo: 170,
    paneer: 265,
    'paneer tikka': 220,
    egg: 155,
    'egg curry': 140,
    biryani: 180,
    'vegetable curry': 80,
    sabji: 70,
    tarkari: 70,
    thukpa: 90,
    chowmein: 150,
    samosa: 260,
    pakora: 280,
    chai: 60,
    tea: 40,
    lassi: 100,
    yogurt: 60,
    dahi: 60,
    milk: 60,
  };

  // Find matching food
  for (const [food, calories] of Object.entries(calorieEstimates)) {
    if (lower.includes(food)) {
      return Math.round((calories * grams) / 100);
    }
  }

  // Default estimate
  return Math.round((120 * grams) / 100);
}

// Singleton instance
let voiceServiceInstance: VoiceRecognitionService | null = null;

export function getVoiceRecognitionService(): VoiceRecognitionService {
  if (!voiceServiceInstance) {
    voiceServiceInstance = new VoiceRecognitionService();
  }
  return voiceServiceInstance;
}
