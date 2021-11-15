import React from 'react';
import { Switch, Route } from 'react-router-dom';

import '../stylesheets/styles.scss'
import Home from './pages/home/Home';

function App() {
  return (
    <Switch>
      <Route path='/' exact component={Home}></Route>
    </Switch>
  );
}

export default App;
