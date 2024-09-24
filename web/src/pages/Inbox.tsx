import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {getInbox} from "../DAO";
import Nav from "../components/Nav";
import Loading from "../components/Loading";
import MessageTotal from "../components/MessageTotal";
import MessageList from "../components/MessageList";
import Footer from "../components/Footer";
import Error from "../components/Error";
import {ReactComponent as Reload} from "../img/reload.svg";
import "./Inbox.css";

interface InboxRouterProps {
  username: string;
}

function Inbox({match}: RouteComponentProps<InboxRouterProps>) {
  const username = match.params.username;
  const [loading, setLoading] = useState();
  const [mounted, setMounted] = useState(false);
  const [inbox, setInbox] = useState();
  const [altinbox, setAltInbox] = useState();
  const [error, setError] = useState();
  const [fade, setFade] = useState("");
  let loadingTimeout: any;
  let fadeTimeout: any;

  function updateInbox(firstTime: boolean) {
    loadingTimeout = setTimeout(() => setLoading(true), 1000);
    if (!firstTime) {
      setFade("fade");
    }
    // fetch(`${API_HOST}/mailbox/${username}`, FETCH_OPTIONS).then((response) => response.json()).then((data) => {
    getInbox(username).then((data) => {
      setInbox(data.messages);
      setAltInbox(data.altinbox);
      if (firstTime) {
        setMounted(true);
      } else {
        fadeTimeout = setTimeout(() => setFade(""), 300);
      }
    }, (reason) => {
      if (reason === "rate limited") {
        setError("Uh oh! You need to slow down on the reload button.");
        setFade("");
      }
    }).finally(() => {
      if (!!loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    updateInbox(true);
    return () => {
      if (!!loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      if (!!fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
    };
  }, [username]);

  return (
    <div className="page page-inbox page-internal">
      <Helmet>
        <title>{username} inbox | Maildrop</title>
        <meta name="description"
              content="View the mail messages sent to {username}."/>
      </Helmet>
      <div className="inbox-top-container">
        <Nav compact={true}/>
      </div>
      <section className="inbox-main-section">
        <h1 className="inbox-title">{username}@maildrop.cc</h1>
        {loading === true &&
        <Loading/>
        }
        {mounted &&
        <div className="inboxheader-container">
          <MessageTotal inbox={inbox}/>
          <button onClick={() => updateInbox(false)}><Reload/><span>Reload</span></button>
        </div>
        }
        <div className={"fade-container " + fade}>
          {mounted && inbox && inbox.length > 0 &&
          <MessageList inbox={inbox} username={username} reload={() => updateInbox(false)}/>
          }
        </div>
      </section>
      <section className="inbox-sponsor-section">
        <div className="triangle sponsor-triangle">&nbsp;</div>
        <div className="altinbox-container">
          <h4>Alias address:</h4>
          {altinbox &&
          <p className="altinbox">{altinbox}@maildrop.cc</p>
          }
          {!altinbox &&
            <Loading/>
          }
          <p>
            Email sent to the above alias address will also show up in this inbox. Use an alias address when you need a
            little bit more security - people cannot view the alias address inbox without knowing the original address.
          </p>
        </div>
        <div className="sponsor-container">
          <h4>Maildrop sponsors:</h4>

          <p>
            <a href="https://heluna.com">Heluna Antispam</a> - Cloud-based antispam for your domain.
          </p>

          <p>
            Maildrop keeps running thanks to the generosity of its sponsors. <Link to="/contact-us">Please contact
            us</Link> if you're interested in sponsoring Maildrop.
          </p>
        </div>
      </section>
      <Footer/>
      {error &&
      <Error message={error} timeout={7000} unmount={() => setError(undefined)}/>
      }
    </div>
  );
}

export default Inbox;
