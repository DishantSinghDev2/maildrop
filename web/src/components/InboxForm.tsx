import React, {FormEvent, useEffect, useState} from "react";
import history from "../history";
import {ReactComponent as Logo} from "../img/logo.svg";
import "./InboxForm.css";

interface InboxFormProps {
  remember?: boolean;
}

function InboxForm(props: InboxFormProps) {
  const [inbox, setInbox] = useState("");

  function submitForm(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    const sanitizedInbox = inbox.trim().toLowerCase();
    if (sanitizedInbox.length === 0) {
      history.push("/inbox/lazy");
    } else {
      window.localStorage.setItem("inbox", sanitizedInbox);
      history.push(`/inbox/${sanitizedInbox}`);
    }
  }

  useEffect(() => {
    if (!!props.remember) {
      const localInbox = window.localStorage.getItem("inbox");
      if (!!localInbox) {
        setInbox(localInbox);
      }
    }
  }, []);

  return (
    <form className="inboxform-container" onSubmit={(e) => submitForm(e)}>
      <div className="inboxform-input">
        <input type="text" onChange={(e) => setInbox(e.target.value)} placeholder="view-this-inbox" value={inbox}/>
        <span>@ maildrop.cc</span>
      </div>
      <button><Logo/><span>View Inbox</span></button>
    </form>
  );
}

export default InboxForm;
