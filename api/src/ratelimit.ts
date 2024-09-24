

const RATELIMIT: number = parseInt(process.env.RATELIMIT || "10");

export default async function ratelimit(ip: string, client: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const key = `lambdalimit:${ip}`;
    client.hGetAll(key, (error: any, result: { tokens: string; }) => {
      if (error) {
        reject(JSON.stringify(error));
      } else {
        if (!!result && result.tokens) {
          let tokens = parseInt(result.tokens) - 1;
          if (tokens < 0) {
            // A race condition can lead to the key never expiring; check for that
            client.ttl(key, (_error: any, result: number) => {
              if (result === -1) {
                client.expire(key, 1);
              }
            });
            reject("rate limited");
          } else {
            client.ttl(key, (_error: any, result: number) => {
              if (result === -1) {
                client.expire(key, 1);
              }
              client.hset(key, "tokens", tokens.toString());
              resolve();
            });
          }
        } else {
          client.hset(key, "tokens", (RATELIMIT - 1).toString());
          client.expire(key, 60);
          resolve();
        }
      }
    })
  });
}
