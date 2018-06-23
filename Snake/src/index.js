import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
// import { Store } from './store';
import { Provider } from "mobx-react";
// import Maps from './map';
import Maps from "./new-src/map";
import { Store } from "./new-src/store/index";

// todolist
// import * as Store from "./todo/store/index";
// import Maps from "./todo/app";

ReactDOM.render(
  <Provider {...Store}>
    <Maps />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
