import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../../Components/Login/Login';
import Register from '../../Components/Register/Register';
import GeneralCheckList from '../../Components/GeneralCheckList/GeneralCheckList';
import EventCheckList from '../../Components/EventCheckList/EventCheckList';
import GeneralSearchResults from '../GeneralSearchResults/GeneralSearchResults';
import EventSearchResults from '../EventSearchResults/EventSearchResults';
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route 
          path={'/register'}
          component={Register}
        />
        <Route
          path={'/login'}
          component={Login}
        />
        <Route 
          path={'/general'}
          component={GeneralCheckList}
        />
        <Route
          path={'/event'}
          component={EventCheckList}
        />
        <Route 
          path={'/generalSearch'}
          component={GeneralSearchResults}
        />
        <Route
          path={'/eventSearch'}
          component={EventSearchResults}
        />
      </Switch>
    </div>
  );
}

export default App;