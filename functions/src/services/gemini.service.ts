import {
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { SupportedCrashlyticsEvent } from "../models/app-crash";

/**
 * Implements a service for interacting with Gemini LLM
 */
export class GeminiService {
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private genAI: GoogleGenerativeAI;
  private static readonly MODEL_NAME = "gemini-pro";
  private static readonly GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  // Block harmful content, hate speech etc
  // Should not be needed or applicable to this use case
  private static readonly SAFETY_SETTINGS = [];

  /**
   * Make Gemini LLM explain a crashlytics event.
   * 
   * @param {SupportedCrashlyticsEvent} appCrash App crash information
   * @returns {Promise<string>} Promise with the explanation
   */
  async explainCrash(appCrash: SupportedCrashlyticsEvent): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: GeminiService.MODEL_NAME });

    const promptContext = `
    @type defines the type of crashlytics issue.

    CrashlyticsRegressionAlertPayload is an issue that was previously fixed but has reappeared.
    resolveTime - The time that the Crashlytics issues was most recently resolved before it began to reoccur.
    
    CrashlyticsNewNonfatalIssuePayload is a Non Fatal issue.
    
    CrashlyticsNewFatalIssuePayload is a Fatal issue.

    CrashlyticsNewAnrIssuePayload is an Application Not Responding issue.
    `;

    const promptExplanation = `
    Explain the the following crashlytics issue for a software developer.
    Explain the issue in a way that is easy to understand and actionable.
    Use the following JSON information to explain the issue:
    `;

    const crashJson = JSON.stringify(appCrash)

    const parts = [
      {text: [promptContext, promptExplanation, crashJson].join("\n\n")},
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: GeminiService.GENERATION_CONFIG,
      safetySettings: GeminiService.SAFETY_SETTINGS,
    });

    return result.response.text();
  }
}