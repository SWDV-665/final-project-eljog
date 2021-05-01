import { Capacitor } from '@capacitor/core';
import { Auth } from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import awsconfig from './config.js';
import NativeKeyValueStorage from './nativeStorage';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import store from './store';

if (Capacitor.getPlatform() === "android") {
  // Amplify library has trouble with initializing state from NativeKeyValueStorage,
  // hence using default storage for noow
  Auth.configure({ ...awsconfig });
}
else {
  Auth.configure({ ...awsconfig, storage: NativeKeyValueStorage });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
