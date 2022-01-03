/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from './components/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import theme from './style/theme';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
