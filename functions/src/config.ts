const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG || "{}");
export const projectId = FIREBASE_CONFIG.projectId ??
    process.env.GCP_PROJECT ??
    process.env.GCLOUD_PROJECT ??
    process.env.GOOGLE_CLOUD_PROJECT;
