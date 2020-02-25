import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import { BrowserRouter } from 'react-router-dom';
import { ListProvider } from '../src/Context/ListContext';

ReactDOM.render(
  <BrowserRouter>
    <ListProvider>
      <App />
    </ListProvider>
  </BrowserRouter>, document.getElementById('root'));