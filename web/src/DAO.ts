export interface MessageObj {
  html: string;
  body: string;
  id: string;
  from: string;
  subject: string;
  date: string;
}

export interface InboxObj {
  altinbox: string;
  messages: MessageObj[];
}

const API_HOST = process.env.REACT_APP_API_HOST || "https://api.maildrop.cc/v2";
const API_KEY = process.env.REACT_APP_API_KEY || "";
const FETCH_OPTIONS = {headers: {"x-api-key": API_KEY}};

export function getInbox(username: string): Promise<InboxObj> {
  return fetch(`${API_HOST}/mailbox/${username}`, FETCH_OPTIONS).then((response) => response.json())
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error);
      } else {
        return data;
      }
    });
}

export function getMessage(username: string, id: string): Promise<MessageObj> {
  return fetch(`${API_HOST}/mailbox/${username}/${id}`, FETCH_OPTIONS).then((response) => response.json())
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error);
      } else {
        return data;
      }
    });
}

export function deleteMessage(username: string, id: string): Promise<boolean> {
  return fetch(`${API_HOST}/mailbox/${username}/${id}`, Object.assign({}, FETCH_OPTIONS, {
    method: "DELETE",
  })).then((response) => response.json()).then((data) => {
    if (data && data.deleted) {
      return data.deleted;
    } else {
      return Promise.reject("not deleted");
    }
  });
}
