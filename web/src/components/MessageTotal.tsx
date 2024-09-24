import React from "react";
import {MessageObj} from "../DAO";
import "./MessageTotal.css";

interface InboxProps {
  inbox: MessageObj[];
}

function MessageTotal(props: InboxProps) {
  return (
    <div className="messagetotal-container">
      {props.inbox.length === 0 &&
      <h5>This inbox is empty.</h5>
      }
      {props.inbox.length > 0 &&
      <h5>{props.inbox.length} message{props.inbox.length !== 1 ? "s" : ""}</h5>
      }
    </div>
  );
}

export default MessageTotal;
