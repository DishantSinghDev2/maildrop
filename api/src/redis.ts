import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS || '127.0.0.1:6379';

const client = createClient({ url: `redis://${REDIS_URL}` });

// Connect the client before using it
client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await client.connect();  // This ensures the client is connected before use
})();

export default client;
