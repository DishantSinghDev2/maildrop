import React, {useEffect} from "react";
import {withRouter} from "react-router";

interface ScrollProps {
  location: any;
  children: any;
}

function ScrollToTop(props: ScrollProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location]);

  return (props.children);
}

// @ts-ignore
export default withRouter(ScrollToTop);
