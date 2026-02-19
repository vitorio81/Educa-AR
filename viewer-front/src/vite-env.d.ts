interface ImportMetaEnv {
  readonly VITE_API_URL_LOGIN: string;
  readonly VITE_API_URL_MODEL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}