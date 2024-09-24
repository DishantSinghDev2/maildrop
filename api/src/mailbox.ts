import Redis, {RedisClient} from "redis";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import bigInt from "big-integer";
import ratelimit from "./ratelimit";
import {simpleParser} from "mailparser";

const REDIS: string = process.env.REDIS || "127.0.0.1:6379";
const client: RedisClient = Redis.createClient({url: `redis://${REDIS}`});
const ALTINBOX_MOD: number = parseInt(process.env.ALTINBOX_MOD || "20190422");

export function getInbox(mailbox: string): Promise<Array<object>> {
  return new Promise<Array<any>>((resolve, reject) => {
    client.lrange(`mailbox:${mailbox}`, 0, -1, (error, results) => {
      if (!!error) {
        reject(error);
      } else {
        resolve(results.map((result) => JSON.parse(result)));
      }
    });
  });
}

export function getMessage(mailbox: string, id: string): Promise<object> {
  return new Promise<object>((resolve, reject) => {
    client.lrange(`mailbox:${mailbox}:body`, 0, -1, (error, results) => {
      if (!!error) {
        reject(error);
      } else {
        const message = results.find((result) => JSON.parse(result).id === id) || "{}";
        resolve(JSON.parse(message));
      }
    });
  });
}

export function parseHtml(message: any): Promise<object> {
  if (!!message.body && !message.html) {
    return simpleParser(message.body).then((result) => {
      if (!!result.html) {
        return Object.assign({}, message, {
          html: result.html
        });
      } else {
        return Object.assign({}, message, {
          html: result.textAsHtml,
        });
      }
    });
  } else {
    return Promise.resolve(message);
  }
}

export function getMessageIndex(key: string, id: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    client.lrange(key, 0, -1, (error, results) => {
      if (!!error) {
        reject(error);
      } else {
        const index = results.findIndex((result) => JSON.parse(result).id === id);
        resolve(index);
      }
    });
  });
}

export function deleteMessage(key: string, index: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    client.multi().lset(key, index, '__deleted__').lrem(key, 0, '__deleted__').exec((error) => {
      if (!!error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function deleteBoth(mailbox: string, id: string): Promise<boolean> {
  const listKey = `mailbox:${mailbox}`;
  const bodyKey = `mailbox:${mailbox}:body`;
  return Promise.all([
    getMessageIndex(listKey, id).then((index) => deleteMessage(listKey, index)),
    getMessageIndex(bodyKey, id).then((index) => deleteMessage(bodyKey, index))
  ]).then(() => true, () => false);
}

export function encryptMailbox(mailbox: string): string {
  // - Strip non alpha-numeric characters
  // - Convert the regular inbox to a long
  // - Reverse the digits and prepend a 1
  // - Add the private modifier
  // - Convert back to base36
  // - Prepend prefix
  const num = bigInt(mailbox.toLowerCase().replace(/[^0-9a-z]/gi, ''), 36);
  const encryptedNum = bigInt(`1${num.toString().split("").reverse().join("")}`).add(ALTINBOX_MOD);
  return `D-${encryptedNum.toString(36)}`;
}

export async function listHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const ip = "" + event.requestContext.identity.sourceIp;
  const mailbox = (event.pathParameters || {})["name"];
  return ratelimit(ip, client).then(() => {
    console.log(`client ${ip} requesting mailbox ${mailbox}`);
    return getInbox(mailbox);
  }).then((results) => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        altinbox: encryptMailbox(mailbox),
        messages: results
      })
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

export async function messageHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const ip = "" + event.requestContext.identity.sourceIp;
  return ratelimit(ip, client).then(() => {
    const mailbox = (event.pathParameters || {})["name"];
    const id = (event.pathParameters || {})["id"];
    console.log(`client ${ip} requesting mailbox ${mailbox} id ${id}`);
    return getMessage(mailbox, id);
  }).then((results) => parseHtml(results)).then((results) => {
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

export async function deleteHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const ip = "" + event.requestContext.identity.sourceIp;
  return ratelimit(ip, client).then(() => {
    const mailbox = (event.pathParameters || {})["name"];
    const id = (event.pathParameters || {})["id"];
    console.log(`client ${ip} deleting mailbox ${mailbox} id ${id}`);
    return deleteBoth(mailbox, id);
  }).then((deleted) => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({deleted: deleted})
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
