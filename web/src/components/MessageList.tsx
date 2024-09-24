import React, {useRef, useState} from "react";
import dateformat from "dateformat";
import {getMessage, MessageObj} from "../DAO";
import Message from "./Message";
import Loading from "./Loading";
import Error from "./Error";
import "./MessageList.css";

interface InboxProps {
  inbox: MessageObj[];
  username: string;
  reload: () => void;
}

interface MessageCache {
  [id: string]: MessageObj;
}

function MessageList(props: InboxProps) {
  const [viewedmessage, setViewedMessage] = useState();
  const [loading, setLoading] = useState();
  const [messagedata, setMessageData] = useState();
  const [error, setError] = useState();
  const initialCache: MessageCache = {};
  const [messageCache, setMessageCache] = useState(initialCache);
  const listEl: any = useRef();
  let loadingTimeout: any;

  function showMessage(event: React.MouseEvent, id: string) {
    event.stopPropagation();
    event.preventDefault();
    setMessageData(undefined);
    setViewedMessage(id);
    if (messageCache[id]) {
      setMessageData(messageCache[id]);
    } else {
      loadingTimeout = setTimeout(() => setLoading(true), 1000);
      getMessage(props.username, id).then((data) => {
        messageCache[id] = data;
        setMessageCache(messageCache);
        setMessageData(data);
      }, (reason) => {
        if (reason === "rate limited") {
          setError("Uh oh! You need to slow down on the message button.");
        }
      }).finally(() => {
        if (!!loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
        setLoading(false);
      });
    }
  }

  function closeMessage() {
    setMessageData(undefined);
    if (!!listEl && !!listEl.current) {
      const currentLocation = listEl.current.getBoundingClientRect().top;
      if (currentLocation < 0) {
        console.log("scrolling to 0,", currentLocation + window.scrollY);
        window.scrollTo(0, currentLocation + window.scrollY);
      }
    }
  }

  return (
    <div className="messagelist-container" ref={listEl}>
      {error &&
      <Error message={error} timeout={7000} unmount={() => setError(undefined)}/>
      }
      {props.inbox.map((message: MessageObj) => (
        <div id={"messagelist-" + message.id} className="messagelist-row" key={message.id}>
          <a className="messagelist-row-link" href="" onClick={(evt) => showMessage(evt, message.id)}>
            <div className="messagelist-from">
              {message.from}
            </div>
            <div className="messagelist-date">
              {dateformat(new Date(message.date.replace("+0000", "Z")), "mmm dd h:MMtt")}
            </div>
            <div className="messagelist-subject">
              <span>{message.subject}</span>
            </div>
          </a>
          {viewedmessage === message.id &&
          <>
            {loading === true &&
            <Loading/>
            }
            {messagedata &&
            <Message data={messagedata} username={props.username} unmount={() => closeMessage()}
                     reload={props.reload}/>
            }
          </>
          }
        </div>
      ))}
    </div>
  );
}

export default MessageList;
