import React, { memo } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import WithAuthRoute from './WithAuthRoute';
import Header from '../components/Header';
import Login from '../pages/Login';

const Routes = memo(() => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Redirect
                to={{
                  pathname: 'login',
                }}
              />
            )}
          />
          <WithAuthRoute notAuthenticated path="/login">
            <Login />
          </WithAuthRoute>
          <WithAuthRoute path="/home">
            <div>Logged</div>
          </WithAuthRoute>
        </Switch>
      </div>
    </BrowserRouter>
  );
});

export default Routes;
