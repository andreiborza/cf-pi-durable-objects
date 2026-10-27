// Two prompts to the same Durable Object, with a restart between them.
const base = process.env.BASE_URL ?? 'http://localhost:8787';
const url = `${base}/agents/assistant/${process.argv[2] ?? `chat-${Date.now()}`}`;
const post = (path, message) =>
  fetch(url + path, { method: 'POST', body: JSON.stringify({ message }) }).then(r => r.text());

console.log('prompt 1:', await post('', 'first'));
console.log('prompt 2 (same instance):', await post('', 'second'));
await post('/restart', 'x').catch(() => {});
console.log('restarted the Durable Object');
console.log('prompt 3 (after restart):', await post('', 'third'));
