import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {generateCombination} from "gfycat-style-urls";
import {Helmet} from "react-helmet";
// @ts-ignore
import AdSense from "react-adsense";
import Nav from "../components/Nav";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import Error from "../components/Error";
import InboxForm from "../components/InboxForm";
import {ReactComponent as Reload} from "../img/reload.svg";
import "./Home.css";

function Home() {
  const API_HOST = process.env.REACT_APP_API_HOST || "https://api.maildrop.cc/v2";
  const API_KEY = process.env.REACT_APP_API_KEY || "";
  const ADSENSE = process.env.REACT_APP_ADSENSE_ID;
  const ADSENSE_SLOT = process.env.REACT_APP_ADSENSE_SLOT;
  const FETCH_OPTIONS = {headers: {"x-api-key": API_KEY}};
  const [suggestion, setSuggestion] = useState(getSuggestion());
  const [statistics, setStatistics] = useState({queued: 0, denied: 0});
  const [queuedchg, setQueuedchg] = useState(false);
  const [deniedchg, setDeniedchg] = useState(false);
  const [error, setError] = useState();
  let statisticsInterval: any;
  let deniedTimeout: any;
  let queuedTimeout: any;
  let endTimeout: any;

  function getSuggestion(): string {
    return generateCombination(1, "", true);
  }

  function unmountError() {
    setError(undefined);
  }

  function updateStatistics() {
    fetch(`${API_HOST}/statistics`, FETCH_OPTIONS).then((response) => response.json()).then((data) => {
      setStatistics(data);
    });
  }

  useEffect(() => {
    setDeniedchg(true);
    if (!!deniedTimeout) {
      clearTimeout(deniedTimeout);
    }
    deniedTimeout = setTimeout(() => setDeniedchg(false), 2000);
    return () => {
      if (!!deniedTimeout) {
        clearTimeout(deniedTimeout);
      }
    };
  }, [statistics.denied]);

  useEffect(() => {
    setQueuedchg(true);
    if (!!queuedTimeout) {
      clearTimeout(queuedTimeout);
    }
    queuedTimeout = setTimeout(() => setQueuedchg(false), 2000);
    return () => {
      if (!!queuedTimeout) {
        clearTimeout(queuedTimeout);
      }
    };
  }, [statistics.queued]);

  useEffect(() => {
    updateStatistics();

    statisticsInterval = setInterval(() => {
      updateStatistics();
    }, 5000);

    endTimeout = setTimeout(() => {
      clearInterval(statisticsInterval);
    }, 120000);

    return () => {
      // if (!!rateLimitInterval) {
      //   clearInterval(rateLimitInterval);
      // }
      if (!!statisticsInterval) {
        clearInterval(statisticsInterval);
      }
      if (!!endTimeout) {
        clearTimeout(endTimeout);
      }
    };
  }, []);

  // @ts-ignore
  // @ts-ignore
  return (
    <div className="page page-home">
      <Helmet>
        <title>Maildrop</title>
        <meta name="description" content="Maildrop provides free disposable email addresses for use in web forms,
	      app signups, or any other place you&#x27;d like to protect your privacy."/>
      </Helmet>
      <div className="home-top-container">
        <Nav/>
        <div className="home-banner-container">
          <header>
            <h1>Save your inbox from spam.</h1>
            <h3>Use Maildrop when you don't want to give out your real address.</h3>
          </header>
        </div>
      </div>
      <section className="email-section-container">
        <div className="form-container">
          <div className="triangle form-triangle">&nbsp;</div>
          <h4>Make up your own email address.</h4>
          <p>
            No signup required - Maildrop is free for anyone to use when you need a quick, disposable email address.
          </p>
          <InboxForm/>
        </div>
        <div className="suggestion-container">
          <div className="triangle suggestion-triangle">&nbsp;</div>
          <h4>Want a suggestion?</h4>
          <p>
            Don't worry, we've got you covered. Use this wherever you need an email address.
          </p>
          {suggestion &&
          <p className={"suggestion-data"}>
            <Link to={"/inbox/" + suggestion.toLowerCase()}>{suggestion}@maildrop.cc</Link>
          </p>
          }
          {/*{loading &&*/}
          {/*<Loading/>*/}
          {/*}*/}
          <p className="suggestion-button-container">
            <button onClick={() => setSuggestion(getSuggestion())}><Reload/><span>Another Suggestion?</span></button>
          </p>
        </div>
      </section>
      <section className="idea-section-container">
        <div className="idea-container">
          <div className="triangle idea-triangle">&nbsp;</div>
          <h4>Maildrop is a great idea when you...</h4>
          <ul>
            <li>...want to sign up for a website but you're concerned that they might share your address with
              advertisers.
            </li>
            <li>...are required to provide an email address to a mobile app that shouldn't be sending you messages.
            </li>
            <li>...are making a one-off purchase from an ecommerce site where you don't want followup spam about their
              "latest deals" in your inbox.
            </li>
            <li>...publish your email address in a place that it could be picked up by address-harvesting spam bots.
            </li>
            <li>...give your address to companies that have a track record of less-than-stellar security.</li>
            <li><h5 className="using">Using Maildrop in an interesting way?</h5><p><Link to="/contact-us">Let us
              know!</Link></p></li>
          </ul>
        </div>
      </section>
      <section className="antispam-section-container">
        <div className="antispam-container">
          <div className="triangle antispam-triangle">&nbsp;</div>
          <h4>Spam won't hit your Maildrop inbox, either.</h4>
          <p>
            Maildrop is powered by some of the spam filters created by <a href="https://heluna.com">Heluna</a>, used in
            order to block almost all spam attempts before they even get to your Maildrop inbox.
          </p>
          <p>
            Even though Maildrop is a disposable inbox, you won't see a ton of spam messages when it comes time to check
            your email.
          </p>
        </div>
        <div className="statistics-container">
          <h5>Messages blocked by Maildrop:</h5>
          <div
            className={"statistics-number statistics-denied" + (!!statistics.denied ? "" : " loading") +
            (deniedchg ? " changed" : "")}>{statistics.denied || <Loading/>}</div>
          <h5>Messages saved to Maildrop:</h5>
          <div
            className={"statistics-number statistics-queued" + (!!statistics.queued ? "" : " loading") +
            (queuedchg ? " changed" : "")}>{statistics.queued || <Loading/>}</div>
        </div>
      </section>
      <section className="opensource-section-container">
        <div className="triangle opensource-triangle">&nbsp;</div>
        <div className="opensource-container">
          <h4>Maildrop is open source.</h4>
          <p>
            Contribute to Maildrop's <a href="https://gitlab.com/markbeeson/maildrop">development on GitLab</a>.
          </p>
        </div>
        {ADSENSE &&
        <div className="sponsor-google-container">
          <AdSense.Google client={ADSENSE} slot={ADSENSE_SLOT} style={{display: "block"}} responsive="true"/>
        </div>
        }

      </section>
      <Footer/>
      {error &&
      <Error message={error} timeout={7000} unmount={unmountError}/>
      }
    </div>
  );
}

export default Home;
