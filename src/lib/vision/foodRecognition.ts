/**
 * AI Vision Food Recognition Module for NepFit
 *
 * This module provides AI-powered food recognition capabilities
 * that can be integrated with various vision APIs:
 * - Google Cloud Vision
 * - AWS Rekognition
 * - OpenAI GPT-4 Vision
 * - Custom TensorFlow.js models
 */

export interface RecognizedFood {
  name: string;
  confidence: number;
  category: string;
  estimatedGrams: number;
  estimatedCalories: number;
  nutrition?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface VisionAnalysisResult {
  success: boolean;
  foods: RecognizedFood[];
  totalCalories: number;
  totalGrams: number;
  processingTime: number;
  modelUsed: string;
  error?: string;
}

export interface VisionProviderConfig {
  provider: 'google' | 'openai' | 'aws' | 'tensorflow' | 'demo';
  apiKey?: string;
  endpoint?: string;
  modelId?: string;
}

/**
 * Food Recognition Service
 * Provides AI-powered food detection and nutrition estimation
 */
export class FoodRecognitionService {
  private config: VisionProviderConfig;
  private modelLoaded = false;

  constructor(config?: Partial<VisionProviderConfig>) {
    this.config = {
      provider: config?.provider || 'demo',
      apiKey: config?.apiKey,
      endpoint: config?.endpoint,
      modelId: config?.modelId,
    };
  }

  /**
   * Analyze an image for food content
   */
  async analyzeImage(imageData: string | File | Blob): Promise<VisionAnalysisResult> {
    const startTime = Date.now();

    try {
      let result: VisionAnalysisResult;

      switch (this.config.provider) {
        case 'openai':
          result = await this.analyzeWithOpenAI(imageData);
          break;
        case 'google':
          result = await this.analyzeWithGoogleVision(imageData);
          break;
        case 'aws':
          result = await this.analyzeWithAWS(imageData);
          break;
        case 'tensorflow':
          result = await this.analyzeWithTensorFlow(imageData);
          break;
        default:
          result = await this.analyzeWithDemo(imageData);
      }

      result.processingTime = Date.now() - startTime;
      return result;
    } catch (error) {
      return {
        success: false,
        foods: [],
        totalCalories: 0,
        totalGrams: 0,
        processingTime: Date.now() - startTime,
        modelUsed: this.config.provider,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * OpenAI GPT-4 Vision Analysis
   */
  private async analyzeWithOpenAI(imageData: string | File | Blob): Promise<VisionAnalysisResult> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Convert to base64 if needed
    const base64Image = await this.toBase64(imageData);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a food recognition AI specialized in South Asian cuisine (Nepali, Indian).
            Analyze the food image and return a JSON array of detected foods with:
            - name: food name
            - confidence: 0-100 confidence score
            - category: main_course/snack/beverage/dessert/side_dish
            - estimatedGrams: estimated weight in grams
            - estimatedCalories: estimated calories
            - nutrition: { protein, carbs, fat, fiber } in grams

            Focus on accuracy for Nepali and Indian dishes like dal bhat, momo, curry, etc.
            Return ONLY valid JSON, no markdown or explanation.`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify all foods in this image. Estimate portion sizes and nutrition.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    try {
      const foods: RecognizedFood[] = JSON.parse(content);
      return {
        success: true,
        foods,
        totalCalories: foods.reduce((sum, f) => sum + f.estimatedCalories, 0),
        totalGrams: foods.reduce((sum, f) => sum + f.estimatedGrams, 0),
        processingTime: 0,
        modelUsed: 'openai-gpt4o',
      };
    } catch {
      throw new Error('Failed to parse OpenAI response');
    }
  }

  /**
   * Google Cloud Vision Analysis (placeholder)
   */
  private async analyzeWithGoogleVision(_imageData: string | File | Blob): Promise<VisionAnalysisResult> {
    // Implementation for Google Cloud Vision API
    // Requires @google-cloud/vision package
    throw new Error('Google Vision not implemented. Please configure API key.');
  }

  /**
   * AWS Rekognition Analysis (placeholder)
   */
  private async analyzeWithAWS(_imageData: string | File | Blob): Promise<VisionAnalysisResult> {
    // Implementation for AWS Rekognition
    // Requires @aws-sdk/client-rekognition package
    throw new Error('AWS Rekognition not implemented. Please configure credentials.');
  }

  /**
   * TensorFlow.js Local Model Analysis
   */
  private async analyzeWithTensorFlow(_imageData: string | File | Blob): Promise<VisionAnalysisResult> {
    // Implementation for TensorFlow.js custom model
    // Can run entirely in browser for privacy
    throw new Error('TensorFlow model not loaded. Please load a model first.');
  }

  /**
   * Demo mode - returns simulated results
   * Used for testing and when no API is configured
   */
  private async analyzeWithDemo(_imageData: string | File | Blob): Promise<VisionAnalysisResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Sample food database with nutrition info
    const sampleFoods: RecognizedFood[][] = [
      // Nepali traditional meal
      [
        {
          name: 'Dal (Lentil Soup)',
          confidence: 94,
          category: 'main_course',
          estimatedGrams: 150,
          estimatedCalories: 180,
          nutrition: { protein: 12, carbs: 25, fat: 3, fiber: 8 },
        },
        {
          name: 'Steamed Rice (Bhat)',
          confidence: 96,
          category: 'main_course',
          estimatedGrams: 200,
          estimatedCalories: 260,
          nutrition: { protein: 5, carbs: 56, fat: 1, fiber: 1 },
        },
        {
          name: 'Mixed Vegetable Tarkari',
          confidence: 88,
          category: 'side_dish',
          estimatedGrams: 100,
          estimatedCalories: 80,
          nutrition: { protein: 3, carbs: 12, fat: 3, fiber: 4 },
        },
      ],
      // Momo plate
      [
        {
          name: 'Steamed Chicken Momo',
          confidence: 95,
          category: 'main_course',
          estimatedGrams: 180,
          estimatedCalories: 320,
          nutrition: { protein: 18, carbs: 30, fat: 14, fiber: 2 },
        },
        {
          name: 'Tomato Achar (Dipping Sauce)',
          confidence: 82,
          category: 'side_dish',
          estimatedGrams: 30,
          estimatedCalories: 25,
          nutrition: { protein: 1, carbs: 5, fat: 0, fiber: 1 },
        },
      ],
      // Indian curry meal
      [
        {
          name: 'Paneer Tikka Masala',
          confidence: 91,
          category: 'main_course',
          estimatedGrams: 200,
          estimatedCalories: 380,
          nutrition: { protein: 20, carbs: 15, fat: 28, fiber: 3 },
        },
        {
          name: 'Naan Bread',
          confidence: 94,
          category: 'side_dish',
          estimatedGrams: 80,
          estimatedCalories: 260,
          nutrition: { protein: 8, carbs: 45, fat: 5, fiber: 2 },
        },
      ],
      // Biryani
      [
        {
          name: 'Chicken Biryani',
          confidence: 93,
          category: 'main_course',
          estimatedGrams: 350,
          estimatedCalories: 580,
          nutrition: { protein: 28, carbs: 65, fat: 22, fiber: 3 },
        },
        {
          name: 'Raita',
          confidence: 86,
          category: 'side_dish',
          estimatedGrams: 50,
          estimatedCalories: 40,
          nutrition: { protein: 2, carbs: 4, fat: 2, fiber: 0 },
        },
      ],
      // Breakfast
      [
        {
          name: 'Aloo Paratha',
          confidence: 92,
          category: 'main_course',
          estimatedGrams: 120,
          estimatedCalories: 320,
          nutrition: { protein: 7, carbs: 45, fat: 14, fiber: 4 },
        },
        {
          name: 'Plain Yogurt',
          confidence: 89,
          category: 'side_dish',
          estimatedGrams: 100,
          estimatedCalories: 60,
          nutrition: { protein: 5, carbs: 6, fat: 2, fiber: 0 },
        },
      ],
    ];

    // Select a random sample
    const selectedFoods = sampleFoods[Math.floor(Math.random() * sampleFoods.length)];

    return {
      success: true,
      foods: selectedFoods,
      totalCalories: selectedFoods.reduce((sum, f) => sum + f.estimatedCalories, 0),
      totalGrams: selectedFoods.reduce((sum, f) => sum + f.estimatedGrams, 0),
      processingTime: 0,
      modelUsed: 'demo',
    };
  }

  /**
   * Convert image to base64
   */
  private async toBase64(imageData: string | File | Blob): Promise<string> {
    if (typeof imageData === 'string') {
      // Already base64 or data URL
      if (imageData.startsWith('data:')) {
        return imageData.split(',')[1];
      }
      return imageData;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageData);
    });
  }

  /**
   * Get current provider
   */
  getProvider(): string {
    return this.config.provider;
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<VisionProviderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if a real AI provider is configured
   */
  isRealProviderConfigured(): boolean {
    return this.config.provider !== 'demo' && !!this.config.apiKey;
  }
}

/**
 * Singleton instance for the food recognition service
 */
let foodRecognitionInstance: FoodRecognitionService | null = null;

export function getFoodRecognitionService(config?: Partial<VisionProviderConfig>): FoodRecognitionService {
  if (!foodRecognitionInstance || config) {
    foodRecognitionInstance = new FoodRecognitionService(config);
  }
  return foodRecognitionInstance;
}

/**
 * Quick analyze function for convenience
 */
export async function analyzeFoodImage(
  imageData: string | File | Blob,
  config?: Partial<VisionProviderConfig>
): Promise<VisionAnalysisResult> {
  const service = getFoodRecognitionService(config);
  return service.analyzeImage(imageData);
}
