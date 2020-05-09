import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import ListContext from '../../Context/ListContext';

export default function PublicOnlyRoute({ component, ...props }) {
  const Component = component;
  return (
    <Route
      {...props}
      render={componentProps => (
        <ListContext.Consumer>
          {userContext => {
            if(!!userContext.user.id) {
              return (
                <Redirect to={'/home'} />
              )
            } else {
              return (
                <Component {...componentProps} {...props} />
              )
            }

          }}
        </ListContext.Consumer>
      )}
    />
  );
}