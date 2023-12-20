import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { SupportedCrashlyticsEvent } from "../models/app-crash";

export class GemeniService {
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
  private static readonly SAFETY_SETTINGS = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  async explainCrash(appCrash: SupportedCrashlyticsEvent): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: GemeniService.MODEL_NAME });

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

    const crash = JSON.stringify(appCrash)

    const parts = [
      {text: [promptContext, promptExplanation, crash].join("\n\n")},
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: GemeniService.GENERATION_CONFIG,
      safetySettings: GemeniService.SAFETY_SETTINGS,
    });

    return result.response.text();
  }
}