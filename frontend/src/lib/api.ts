/**
 * API Client for ZenGuard Backend
 * Handles all communication with the sentiment analysis API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Emotion {
  type: string;
  intensity: number;
}

export interface MaskingIndicator {
  detected: boolean;
  confidence: number;
  surface_emotion?: string;
  underlying_emotion?: string;
  indicators: string[];
}

export interface Intervention {
  type: string;
  title: string;
  description: string;
  priority: number;
}

export interface AnalysisResponse {
  wellness_score: number;
  confidence: number;
  primary_emotion: Emotion;
  secondary_emotions: Emotion[];
  emotional_intensity: number;
  masking: MaskingIndicator;
  repetition_detected: boolean;
  emotional_shift: string | null;
  mood_seed_stage: string;
  mood_color: string;
  recommended_interventions: Intervention[];
  supportive_message: string;
  data_stored: boolean;
}

export interface QuickCheckResponse {
  emotional_tone: string;
  intensity: number;
  suggestion: string | null;
}

export interface SessionTrendsResponse {
  session_trend: string;
  trend_confidence: number;
  recurring_themes: string[];
  risk_trajectory: string;
  overall_risk_score: number;
  session_insight: string;
  recommended_intervention: string;
}

export interface VisualAnalysisResponse {
  visual_emotion: string;
  emotional_intensity: number;
  energy_level: string;
  interpretation: string;
  visual_risk_score: number;
  data_stored: boolean;
}

class SentimentClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Check if the API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Perform full sentiment analysis on journal entry
   */
  async analyzeEntry(
    text: string,
    sessionId?: string
  ): Promise<AnalysisResponse> {
    const response = await fetch(`${this.baseUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Quick check for real-time feedback while typing
   */
  async quickCheck(text: string): Promise<QuickCheckResponse> {
    const response = await fetch(`${this.baseUrl}/api/quick-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Quick check failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get session trends analysis
   */
  async getSessionTrends(sessionId: string): Promise<SessionTrendsResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/session/${sessionId}/trends`
    );

    if (!response.ok) {
      throw new Error(`Trend analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Analyze a mood doodle/sketch
   */
  async analyzeVisual(file: File): Promise<VisualAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/analyze-visual`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Visual analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Clear session data
   */
  async clearSession(sessionId: string): Promise<void> {
    await fetch(`${this.baseUrl}/api/session/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const sentimentClient = new SentimentClient();
