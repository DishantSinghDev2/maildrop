import React from "react";
import {Helmet} from "react-helmet";
import Nav from "../components/Nav";
import "./Privacy.css";
import Footer from "../components/Footer";

function Privacy() {
  return (
    <div className="page page-privacy page-internal">
      <Helmet>
        <title>Privacy Policy | Maildrop</title>
        <meta name="description"
              content="The privacy policy for Maildrop. Any message sent to Maildrop can be read by any user."/>
      </Helmet>
      <div className="privacy-top-container">
        <Nav/>
      </div>
      <section className="privacy-text-section">
        <h1>The Maildrop Privacy Policy</h1>
        <p>
          <strong>Please note:</strong> you should have no expectation of privacy when sending messages to your Maildrop
          inbox.
        </p>

        <p>
          Any message sent to Maildrop can be read by any user.
        </p>

        <p>
          Every inbox on Maildrop is available to the public.
        </p>

        <p>
          There are - by design - no security measures to sign into Maildrop and view email messages.
        </p>

        <h2>Do not send sensitive information to Maildrop.</h2>
        <p>
          Please do not send any information to Maildrop that you would consider personal or private. This includes your
          home address, your phone number, or any other personal information. Even if you are constantly monitoring the
          Maildrop inbox you gave to the third party website/app, it is extremely likely that someone else could be
          watching that inbox as well.
        </p>

        <p>
          While it may be unlikely that someone can guess a random inbox, there is no guarantee that other people don't
          have access to your email messages. Please treat Maildrop as if someone else were watching over your shoulder
          at all times.
        </p>

        <h2>Maildrop inbox aliases are not secure.</h2>

        <p>
          While inbox aliases are meant to be a layer of obfuscation to the real email address in maildrop.cc, you
          should be aware that the algorithm which converts from real addresses to inbox aliases, and vice versa, is
          public, and can be easily reverse engineered by a determined individual.
        </p>

        <p>
          Inbox aliases are fine for sending random website/app emails to, but again, please do not send any private,
          personal, confidential messages to an inbox alias; it is extremely likely that someone can and will figure out
          the true inbox that the message is delivered to.
        </p>

        <h2>Connections to Maildrop are logged.</h2>
        <p>
          In order to help refine the service, all email and web connections to Maildrop are logged. Maildrop is not
          designed to be completely anonymous and is not designed to be an alternative to a re-mailer. There are plenty
          of anonymous re-mailers available on the Internet; Maildrop is not one of them.
        </p>

        <p>
          The debugging and connection information that we log is helpful to us, but we cannot provide end users with
          any information about "what happened to my email".
        </p>

        <h2>We do not track our visitors.</h2>
        <p>
          Finally, the only storage we use is to keep track of the most recent inbox that you've visited. We do not
          track our users, nor do we use cookies to keep personal information. We do not collect any information about
          our end users beyond their email and web connections to maildrop.cc and only use our analytics pixel to
          collect aggregate data.
        </p>
      </section>
      <Footer/>
    </div>
  );
}

export default Privacy;
