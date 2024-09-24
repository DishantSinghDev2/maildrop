import Redis, {RedisClient} from "redis";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import ratelimit from "./ratelimit";

const REDIS: string = process.env.REDIS || "127.0.0.1:6379";
const client: RedisClient = Redis.createClient({url: `redis://${REDIS}`});

export function getStats(key: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    client.get(`stats:${key}`, (error, results) => {
      if (!!error) {
        reject(error);
      } else {
        resolve(parseInt(results));
      }
    })
  });
}

export async function statsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const ip = "" + event.requestContext.identity.sourceIp;
  return ratelimit(ip, client).then(() => {
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
