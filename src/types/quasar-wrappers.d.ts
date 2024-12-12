declare module 'quasar/wrappers' {
  import { App } from 'vue';
  export function boot(callback: ({ app }: { app: App }) => void): void;
}
