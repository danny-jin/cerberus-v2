import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Web3ContextProvider } from './hooks/web3Context';
import App from './App';

import './style/index.scss';
import store from './core/store/store'

const queryClient = new QueryClient();

ReactDOM.render(
  <Web3ContextProvider>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter basename={'/#'}>
          <App/>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </Web3ContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
