import {Link, NavLink} from "react-router-dom";
import React from "react";
import {ReactComponent as Logo} from "../img/logo.svg";
import "./Footer.css";

function Footer() {
  const thisYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-logo">
        <Link to="/"><Logo/></Link>
      </div>
      <NavLink to="/how-it-works" activeClassName="active">How Maildrop Works</NavLink>
      <NavLink to="/contact-us" activeClassName="active">Contact Us</NavLink>
      <NavLink to="/privacy" activeClassName="active">Privacy Policy (please read!)</NavLink>
      <div className="created">
        Created in California by <a href="https://heluna.com">Heluna</a> &#169; {thisYear} Build 3.0
      </div>
    </footer>
  );
}

export default Footer;
