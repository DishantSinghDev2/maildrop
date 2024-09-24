import React from "react";
import ReactDOM from "react-dom";
import {Router, Route} from "react-router-dom";
import ReactGA from "react-ga";
import history from "./history";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import ContactUs from "./pages/ContactUs";
import Privacy from "./pages/Privacy";
import Inbox from "./pages/Inbox";
import "normalize.css";
import "./index.css";

if (process.env.REACT_APP_GA) {
  ReactGA.initialize(process.env.REACT_APP_GA);
  ReactGA.pageview("/");
  history.listen((location) => {
    // Double requestAnimationFrames because of react-helmet
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        ReactGA.pageview(location.pathname + location.search);
      });
    });
  });
}

function AppRouter() {
  return (
    <Router history={history}>
      <ScrollToTop>
        <Route path="/" exact component={Home}/>
        <Route path="/how-it-works" exact component={HowItWorks}/>
        <Route path="/contact-us" exact component={ContactUs}/>
        <Route path="/privacy" exact component={Privacy}/>
        <Route path="/inbox/:username" component={Inbox}/>
      </ScrollToTop>
    </Router>
  );
}

ReactDOM.render(<AppRouter/>, document.getElementById("root"));
