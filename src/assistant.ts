import { createModels } from '@earendil-works/pi-ai/models';
import { fauxAssistantMessage, fauxProvider } from '@earendil-works/pi-ai/providers/faux';
import { createRegistry, Harness } from '@earendil-works/pi-durable';
import { Agent } from 'agents';
import { PiHarness } from 'agents/harness/pi';

export class Assistant extends Agent<Env> {
  public registry = createRegistry();

  public harness = new PiHarness({
    harness: ({ storage, context }) => {
      const models = createModels();
      const faux = fauxProvider({ provider: 'faux', models: [{ id: 'faux-model' }] });
      models.setProvider(faux.provider);
      faux.setResponses(Array.from({ length: 50 }, () => () => fauxAssistantMessage('Hello from faux.')));
      return Harness.open(storage, { models, registry: this.registry }, context);
    },
    defaults: { model: { provider: 'faux', id: 'faux-model' } },
  });

  public constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.lifecycle.use(this.harness);
  }

  public async onRequest(request: Request): Promise<Response> {
    // Simulates an eviction: the next request starts a new instance of this object.
    if (new URL(request.url).pathname.endsWith('/restart')) {
      this.ctx.abort('restart');
    }
    const { message } = await request.json<{ message: string }>();
    const { status, reason, text } = await this.harness.prompt(message);
    return Response.json({ status, reason, text });
  }
}
