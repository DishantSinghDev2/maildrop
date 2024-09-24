import React, {useEffect, useState} from "react";
import "./Error.css";

interface ErrorProps {
  message: string;
  timeout: number;
  unmount: () => void;
}

function Error(props: ErrorProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState();
  let closeTimeout: any;
  let unmountTimeout: any;

  function close() {
    setVisible(false);
    unmountTimeout = setTimeout(() => {
      props.unmount();
    }, 500);
  }

  useEffect(() => {
    setMessage(props.message);
    setTimeout(() => {
      setVisible(true);
    }, 20);
    closeTimeout = setTimeout(() => {
      close();
    }, props.timeout);
    return () => {
      if (!!closeTimeout) {
        clearTimeout(closeTimeout);
      }
      if (!!unmountTimeout) {
        clearTimeout(unmountTimeout);
      }
    };
  }, []);

  return (
    <>
      {message &&
      <div className={"Error" + (visible ? " visible" : "")}>
        {message}
      </div>
      }
    </>
  );
}

export default Error;
