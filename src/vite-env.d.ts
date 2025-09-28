/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EIA_API_KEY: string;
  readonly VITE_EIA_API_BASE_URL: string;
  readonly VITE_EIA_ELECTRICITY_ENDPOINT: string;
  readonly VITE_ENABLE_LIVE_DATA: string;
  readonly VITE_DATA_UPDATE_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}