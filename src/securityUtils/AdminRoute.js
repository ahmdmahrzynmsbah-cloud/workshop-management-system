import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const AdminRoute = ({ component: Component, security, ...otherProps }) => {
  const roles = (security.user && security.user.roles) || [];
  const isAdmin = roles.some(
    e =>
      e === "ROLE_ADMIN" ||
      e === "ADMIN" ||
      e.authority === "ROLE_ADMIN" ||
      e.name === "ADMIN" ||
      e.name === "ROLE_ADMIN" ||
      e.role === "ADMIN"
  );

  return (
    <Route
      {...otherProps}
      render={props =>
        security.validToken === true && isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

AdminRoute.propTypes = {
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(mapStateToProps)(AdminRoute);
