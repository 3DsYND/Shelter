import React from 'react';

export default function(props) {
  let timer = null;
  let isShow = props.isShow;
  let setShow = props.setShow;

  function onFocusHandler() {
    clearTimeout(timer);
  }

  function onBlurHandler() {
    timer = setTimeout(() => setShow(false));
  }

  return isShow ? (
    <div className={props.className} onFocus={onFocusHandler} onBlur={onBlurHandler}>
      {props.children}
    </div>
  ) : null;
}
