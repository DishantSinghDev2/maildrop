import React from "react";
import {ReactComponent as Logo} from "../img/logo.svg";
import "./Loading.css";

function Loading() {
  return (
    <div className="Loading">
      <Logo/>
      <span>Loading...</span>
    </div>
  );
}

export default Loading;
