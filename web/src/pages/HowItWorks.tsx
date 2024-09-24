import React from "react";
import {Helmet} from "react-helmet";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "./HowItWorks.css";

function HowItWorks() {
  return (
    <div className="page page-howitworks page-internal">
      <Helmet>
        <title>How Maildrop Works | Maildrop</title>
        <meta name="description"
              content="Maildrop is a free throwaway email address. It's temporary. It's transient. It's disposable."/>
      </Helmet>
      <div className="howitworks-top-container">
        <Nav/>
      </div>
      <section className="howitworks-text-section">
        <h1>"Please enter your email address."</h1>
        <p>
          What's your default reaction when you see that statement in a page, or an app, or someone asks you that
          question? For a large amount of people, a sudden feeling of unease, dread, or mistrust immediately washes over
          them, and for good reason. Email, once a valued communication medium online, is now almost entirely dominated
          by spam, marketing junk, and unimportant messages that do nothing but waste your time.
        </p>
        <p>
          These days, giving out your email address is a very personal act, as it implies a level of trust that often
          times you're not willing to give to any random website or app. You're entrusting the site, or app, or company,
          not to sell or give out your address. You're also trusting their security, that they won't get hacked, or
          otherwise lose your personal info.
        </p>

        <h2>Enter Maildrop to the rescue.</h2>

        <p>
          Maildrop is a free throwaway email address. It's temporary. It's transient. It's disposable. It's meant for
          those times when you don't want to give out your real address. Just give someone any email address in the
          maildrop.cc domain, come back here, put in the email address, and you can see that inbox.
        </p>

        <p>
          Maildrop has no signups.
        </p>

        <p>
          Maildrop has no passwords.
        </p>

        <p>
          Maildrop is designed for no security.
        </p>

        <p>
          Maildrop is designed for little to no privacy.
        </p>

        <p>
          Maildrop offers the ability to give out a quick email address to any site or app, then after you've
          established more trust with that site, you can give them your real email address.
        </p>

        <p>
          Maildrop helps to stop your inbox from getting flooded with spam from that one time you registered on a site
          which got hacked.
        </p>

        <p>
          Maildrop can be used to get your receipt for your ecommerce purchase, without signing up to be spammed on a
          regular basis with "latest offers".
        </p>

        <p>
          In short, Maildrop can help you cut out the amount of junk in your inbox.
        </p>

        <h2>What kind of email does Maildrop accept?</h2>

        <p>
          Maildrop is extremely strict about the content of messages allowed into inboxes. Plain text or HTML emails
          are allowed, but must be less than 500k in length. All attachments in messages are removed and discarded -
          this means no sending files to an inbox.
        </p>

        <p>
          An inbox can hold at most 10 messages, and any inbox which does not receive a message within 24 hours will be
          automatically cleared. Additionally, there is a finite amount of space to store all of the messages in all
          Maildrop inboxes, so any particular inbox that has not recently received a message may be cleared to make room
          for more active inboxes.
        </p>

        <p>
          Content-wise, Maildrop does not allow any email messages having to do with any illegal activities in your
          country, state, city, or region. Please check with your local law enforcement agency for more information.
        </p>

        <h2>Maildrop also blocks spam.</h2>

        <p>
          Before a message makes its way into an inbox, it needs to get through multiple spam filters. These filters are
          proven to reduce the overall amount of spam by more than 90%, so Maildrop inboxes won't be flooded by junk
          email. Here are some of the filters that messages are subjected to:
        </p>

        <p>
          Email servers are checked to ensure that they aren't flooding Maildrop with connections, or have bad spam
          reputations, or are listed on any of multiple network-based blacklists.
        </p>

        <p>
          From addresses are checked to ensure that messages from a domain are coming from valid email servers in that
          domain.
        </p>

        <p>
          All connections are then greylisted, meaning that only valid email servers are allowed to deliver messages to
          Maildrop inboxes.
        </p>

        <p>
          Finally, message subjects are checked to make sure Maildrop isn't getting bombarded by the same message over
          and over again.
        </p>

        <p>
          Only after a message passes through all of these filters will it be delivered to an inbox. Even though
          Maildrop may get a huge amount of attempted connections, nearly all spam messages to Maildrop will be
          rejected.
        </p>

        <h2>Try Maildrop out - you'll love it!</h2>

        <p>
          The next time a web form or app asks you to "please enter your email address" you'll be ready. "No problem,
          it's whatever@maildrop.cc." When that site sells your email address, you can shrug, move onto another
          disposable Maildrop address, and your real email won't get filled with junk mail.
        </p>

        <p>
          Need some help picking the perfect address? A good strategy is to include the name of the site or app in the
          address itself, that way you know immediately which sites are suspect with regards to your privacy.
        </p>

        <p>
          For example: MyGreatAddress.SiteA@maildrop.cc or MyGreatAddress.AppA@maildrop.cc or
          MyGreatAddress.SiteB@maildrop.cc and so on.
        </p>

      </section>
      <Footer/>
    </div>
  );
}

export default HowItWorks;
