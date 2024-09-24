import React from "react";
import {Helmet} from "react-helmet";
import Nav from "../components/Nav";
import "./ContactUs.css";
import {Link} from "react-router-dom";
import Footer from "../components/Footer";

function ContactUs() {
  return (
    <div className="page page-contactus page-internal">
      <Helmet>
        <title>Contact Us | Maildrop</title>
        <meta name="description"
              content="If you have any questions or comments about Maildrop, feel free to get in touch."/>
      </Helmet>
      <div className="contactus-top-container">
        <Nav/>
      </div>
      <section className="contactus-text-section">
        <h1>Have Questions or Comments?</h1>
        <p>
          We're happy to answer any questions or discuss any comments you might have. First, though, please take these
          notes into consideration.
        </p>

        <h2>Maildrop cannot send you email.</h2>
        <p>
          Maildrop is designed to accept email messages only, and cannot send any messages. If you see any messages
          coming from maildrop.cc, please ignore and delete them - someone else is spoofing maildrop.cc addresses. There
          is no way to send a message from a Maildrop inbox to another email address.
        </p>

        <h2>Messages in your inbox may disappear anytime.</h2>
        <p>
          Due to the amount of incoming mail, older messages and inboxes that haven't received a message in a while may
          be automatically deleted to make space. If you're looking for a message that is older than 24 hours it is
          extremely likely that the message is gone.
        </p>

        <h2>Anyone can read your Maildrop email.</h2>
        <p>
          Please see our <Link to="/privacy">Privacy Policy</Link> for more information. Since Maildrop doesn't require
          any logins or passwords, please do not use your Maildrop inbox for anything that you would like to be kept
          private or secure. Maildrop addresses are meant to be temporary and disposable.
        </p>

        <h2>Maildrop greylists every email server.</h2>
        <p>
          If Maildrop receives a message from an email server it hasn't communicated with yet, that server goes onto
          something called a "greylist", where the server is told it needs to retry the message after a given period of
          time. Due to this, messages from new (to Maildrop) servers may be delayed by at least fifteen minutes, and
          often times up to an hour.
        </p>

        <h2>Maildrop doesn't allow large messages.</h2>
        <p>
          If you're trying to send large attachments to a Maildrop inbox, they will be refused. The largest message
          allowed is 500k. Other attachments will be deleted automatically.
        </p>

        <h2>Still have a question or comment?</h2>
        <p>
          No problem - just email Maildrop at <a
          href="mailto:D-1oi1re74a6@maildrop.cc">D-1oi1re74a6@maildrop.cc</a> (yes,
          you're emailing a Maildrop inbox alias!).
        </p>
      </section>
      <Footer/>
    </div>
  );
}

export default ContactUs;
