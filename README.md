# cf-pi-durable-objects

This app shows that pi-durable in an `agents` Durable Object gets a new `gen_ai.conversation.id` after the object restarts. It uses the offline `faux` provider of pi-ai, so no LLM API key is necessary.

## Run

1. `pnpm install`
2. `cp .dev.vars.example .dev.vars` and set `SENTRY_DSN`.
3. `pnpm start` (builds the Worker and runs `vite preview`, prints the port)
4. `BASE_URL=http://localhost:<port> pnpm try`

`try` sends two prompts to one Durable Object, restarts the object with `ctx.abort()`, and sends a third prompt. The server log prints one `[repro] invoke_agent gen_ai.conversation.id=...` line for each run:

```
[repro] invoke_agent gen_ai.conversation.id=d6380950f8964f72a65512d77ab64b85:1
[repro] invoke_agent gen_ai.conversation.id=d6380950f8964f72a65512d77ab64b85:1
[repro] invoke_agent gen_ai.conversation.id=062742a6c36446f59e9ff93e3ff88640:1
```

The first two ids are the same. The third id is different, but it is the same pi-durable conversation (`1`).

`pnpm dev` (`vite dev`) does not instrument pi-durable, because Vite pre-bundles it. Use `pnpm start`.

Tested with `@sentry/cloudflare` 11.9.0, `@earendil-works/pi-durable` 1.2.0 and `agents` 0.26.0.
