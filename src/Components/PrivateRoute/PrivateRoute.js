import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import ListContext from '../../Context/ListContext';

export default function PrivateRoute({ component, ...props }) {
  const Component = component
  return (
    <Route
      {...props}
      render={componentProps => (
        <ListContext.Consumer>
          {userContext =>
            !!userContext.user.id
              ? <Component {...componentProps} {...props} />
              : (
                <Redirect
                  to='/login'
                />
              )
          }
        </ListContext.Consumer>
      )}
    />
  )
}