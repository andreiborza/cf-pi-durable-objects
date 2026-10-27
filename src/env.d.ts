declare namespace Cloudflare {
  interface Env {
    SENTRY_DSN: string;
    Assistant: DurableObjectNamespace;
  }
}

interface Env extends Cloudflare.Env {}
