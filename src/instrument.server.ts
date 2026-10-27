import { defineCloudflareOptions } from '@sentry/cloudflare';

export default defineCloudflareOptions((env: Env) => ({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  beforeSendSpan(span) {
    const id = span.attributes?.['gen_ai.conversation.id'];
    if (span.name === 'invoke_agent' && id) {
      console.log(`[repro] invoke_agent gen_ai.conversation.id=${String(typeof id === 'object' ? (id as { value: unknown }).value : id)}`);
    }
    return span;
  },
}));
