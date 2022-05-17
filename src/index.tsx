import React from 'react';
import {MainUI} from './views/MainUI';
import reportWebVitals from './reportWebVitals';
import configureStore from "./rootReducer/store";
import {Provider} from "react-redux";
import {createRoot} from "react-dom/client";

const store = configureStore();

const root = createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <MainUI/>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
