import client from "./redis";
import bigInt from "big-integer";
import ratelimit from "./ratelimit";
import { ParsedMail, simpleParser } from "mailparser";
import { promisify } from "util";

const ALTINBOX_MOD: number = parseInt(process.env.ALTINBOX_MOD || "20190422");

const lRangeAsync = promisify(client.lRange).bind(client);

export function getInbox(mailbox: string): Promise<Array<object>> {
  return lRangeAsync(`mailbox:${mailbox}`, 0, -1).then((results: any[]) => {
    return results.map((result: string) => JSON.parse(result));
  });
}

export function getMessage(mailbox: string, id: string): Promise<object> {
  return lRangeAsync(`mailbox:${mailbox}:body`, 0, -1).then((results: any[]) => {
    const message = results.find((result: string) => JSON.parse(result).id === id) || "{}";
    return JSON.parse(message);
  });
}

export function parseHtml(message: any): Promise<object> {
  if (!!message.body && !message.html) {
    return simpleParser(message.body).then((result: ParsedMail) => {
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
    lRangeAsync(key, 0, -1, (error: any, results: any[]) => {
      if (!!error) {
        reject(error);
      } else {
        const index = results.findIndex((result: string) => JSON.parse(result).id === id);
        resolve(index);
      }
    });
  });
}


export function deleteMessage(key: string, index: number): Promise<void> {
  return client.multi().lSet(key, index, '__deleted__').lRem(key, 0, '__deleted__').exec().then(() => {
    return;
  }).catch((error: any) => {
    return Promise.reject(error);
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

export async function listHandler(req: any, res: any): Promise<any> {
  const ip = req.ip;  // Use req.ip for client IP in Express
  const mailbox = req.params.name;  // Use req.params for path parameters
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
      body: JSON.stringify({ error: reason })
    };
  });
}

export async function messageHandler(event: any): Promise<any> {
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
      body: JSON.stringify({ error: reason })
    };
  });
}

export async function deleteHandler(event: any): Promise<any> {
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
      body: JSON.stringify({ deleted: deleted })
    };
  }, (reason) => {
    console.log(`error for ${ip} : ${reason}`);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: reason })
    };
  });
}
