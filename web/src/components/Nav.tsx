import {Link, NavLink} from "react-router-dom";
import React from "react";
import InboxForm from "../components/InboxForm";
import {ReactComponent as Logo} from "../img/logo.svg";
import "./Nav.css";

interface NavProps {
  compact?: boolean;
}

function Nav(props: NavProps) {
  return (
    <div className={"nav-container" + (!!props.compact ? " compact" : "")}>
      <nav>
        <div className="nav-left">
          <div className="nav-logo">
            <Link to="/">
              <Logo/>
              <div className="logotype">Maildrop</div>
            </Link>
          </div>
          <div className="nav-links">
            <NavLink to="/how-it-works" activeClassName="active">How It Works</NavLink>
            <NavLink to="/contact-us" activeClassName="active">Contact Us</NavLink>
          </div>
        </div>
        <div className="nav-right">
          <InboxForm remember={true}/>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
