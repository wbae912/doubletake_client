import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../../Components/Login/Login';
import Register from '../../Components/Register/Register';
import GeneralCheckList from '../../Components/GeneralCheckList/GeneralCheckList';
import EventCheckList from '../../Components/EventCheckList/EventCheckList';
import NotFound from '../NotFound/NotFound';
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
          component={NotFound}
        />
      </Switch>
    </div>
  );
}

export default App;