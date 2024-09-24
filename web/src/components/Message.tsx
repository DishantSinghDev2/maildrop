import React, {useEffect, useRef, useState} from "react";
import {MessageObj, deleteMessage as deleteDao} from "../DAO";
import Error from "./Error";
import Loading from "./Loading";
import {ReactComponent as Document} from "../img/document.svg";
import {ReactComponent as Close} from "../img/close.svg";
import {ReactComponent as Trash} from "../img/trash.svg";
import "./Message.css";

interface MessageProps {
  data: MessageObj;
  username: string;
  unmount: () => void;
  reload: () => void;
}

function Message(props: MessageProps) {
  const [rawsource, setRawSource] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const iframeEl: any = useRef();
  let loadingTimeout: any;

  function deleteMessage() {
    loadingTimeout = setTimeout(() => setLoading(true), 1000);
    deleteDao(props.username, props.data.id).then((deleted) => {
      if (!!loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      setLoading(false);
      if (deleted) {
        props.reload();
        props.unmount();
      }
    }, () => {
      if (!!loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      setLoading(false);
      setError("Uh oh! That message was unable to be deleted.");
    });
  }

  function writeToIframe() {
    if (!!iframeEl && !!iframeEl.current) {
      const doc = iframeEl.current.contentDocument;
      if (!!doc) {
        doc.open();
        doc.write("<style>body {font-family:sans-serif;font-size:14px;padding:0;margin:0;}</style>");
        doc.write(props.data.html);
        doc.close();
        requestAnimationFrame(() => resizeIframe());
      }
    }
  }

  function resizeIframe() {
    if (!!iframeEl && !!iframeEl.current) {
      const doc = iframeEl.current.contentDocument;
      if (!!doc && !!doc.documentElement) {
        iframeEl.current.height = doc.documentElement.scrollHeight + 50;
      }
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => writeToIframe());
  }, [props.data.html]);

  return (
    <div className="messagedata-container">
      {error &&
      <Error message={error} timeout={7000} unmount={() => setError(undefined)}/>
      }
      <div className="messageactions-container">
        <button className="close-button" onClick={props.unmount}>
          <Close/><span>Close</span>
        </button>
        {!rawsource &&
        <button className="rawsource-button" onClick={() => setRawSource(true)}>
          <Document/><span>Show Raw Source</span>
        </button>
        }
        {rawsource &&
        <button className="message-button" onClick={() => setRawSource(false)}>
          <Document/><span>Show Message</span></button>
        }

        {loading &&
        <Loading/>
        }
        <button className="delete-button" onClick={deleteMessage}>
          <Trash/><span>Delete</span>
        </button>
      </div>
      <iframe className={"messagedata-iframe" + (rawsource ? " hidden" : "")} height="30" ref={iframeEl}/>
      {rawsource &&
      <div className="messagesource-container" dangerouslySetInnerHTML={{__html: props.data.body}}/>
      }
    </div>
  );
}

export default Message;
