/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_ENQUIRY_API_BASE_URL?: string;
  readonly VITE_ADMIN_ENQUIRY_API_TARGET?: string;
  readonly VITE_API_TARGET?: string;
  readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
