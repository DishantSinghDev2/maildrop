import client from "./redis";
import ratelimit from "./ratelimit";


export function getStats(key: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    client.get(`stats:${key}`).then((results: string | null) => {
      if (results === null) {
        resolve(0);
      } else {
        resolve(parseInt(results));
      }
    }).catch((error: any) => {
      reject(error);
    });
  });
}

export async function statsHandler(event: any): Promise<any> {
  const ip = "" + event.requestContext.identity.sourceIp;
  return ratelimit(ip).then(() => {
    return Promise.all([getStats("queued"), getStats("denied")]);
  }).then((results) => {
    return {"queued": results[0], "denied": results[1]};
  }).then((results) => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(results)
    };
  }, (reason) => {
    console.log(`error for ${ip} : ${reason}`);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({error: reason})
    };
  });
}
