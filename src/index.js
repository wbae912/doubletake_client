import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import { BrowserRouter } from 'react-router-dom';
import { ListProvider } from '../src/Context/ListContext';
import { ItemProvider } from '../src/Context/ItemContext';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 

ReactDOM.render(
  <BrowserRouter>
    <ListProvider>
      <ItemProvider>
        <App />
      </ItemProvider>
    </ListProvider>
  </BrowserRouter>, document.getElementById('root'));