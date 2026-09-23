import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const WorkshopRoute = ({ component: Component, security, ...otherProps }) => {
  const roles = (security.user && security.user.roles) || [];
  const isOwner = roles.some(
    e =>
      e === "ROLE_WORKSHOPOWNER" ||
      e === "WORKSHOPOWNER" ||
      e.authority === "ROLE_WORKSHOPOWNER" ||
      e.name === "WORKSHOPOWNER" ||
      e.name === "ROLE_WORKSHOPOWNER" ||
      e.role === "WORKSHOPOWNER"
  );

  return (
    <Route
      {...otherProps}
      render={props =>
        security.validToken === true && isOwner ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
};

WorkshopRoute.propTypes = {
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(mapStateToProps)(WorkshopRoute);
