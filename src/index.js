import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App/App';
import { BrowserRouter } from 'react-router-dom';
import { ListProvider } from '../src/Context/ListContext';
import { ItemProvider } from '../src/Context/ItemContext';
import './index.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

ReactDOM.render(
  <BrowserRouter>
    <ListProvider>
      <ItemProvider>
          <App />
      </ItemProvider>
    </ListProvider>
  </BrowserRouter>, document.getElementById('root'));