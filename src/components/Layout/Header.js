import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/securityActions";
import { t, toggleLanguage, getLanguage, subscribeLanguage } from "../../i18n/translations";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: getLanguage(),
      isNavOpen: false
    };
  }

  componentDidMount() {
    this.unsubscribe = subscribeLanguage(lang => {
      this.setState({ lang });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  toggleNav = () => {
    this.setState(prevState => ({ isNavOpen: !prevState.isNavOpen }));
  };

  logout() {
    this.props.logout();
    window.location.href = "/";
  }

  render() {
    const { validToken, user } = this.props.security;
    const { isNavOpen } = this.state;
    const collapseClass = `collapse navbar-collapse ${isNavOpen ? "show" : ""}`;

    const langToggleBtn = (
      <li className="nav-item d-flex align-items-center ml-2 mr-2">
        <button
          type="button"
          className="lang-switch-btn btn btn-sm"
          onClick={() => toggleLanguage()}
          title="Change language / تغيير اللغة"
        >
          <i className="fas fa-globe"></i> {t("switchLanguage")}
        </button>
      </li>
    );

    const userIsAuthenticated = (
      <div className={collapseClass} id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard" onClick={() => this.setState({ isNavOpen: false })}>
              <i className="far fa-list-alt"></i> {t("yourIssues")}
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto align-items-center">
          {langToggleBtn}
          <li className="nav-item">
            <Link className="nav-link" to="/editUser" onClick={() => this.setState({ isNavOpen: false })}>
              <i className="fas fa-user-circle mr-1" /> {user.username}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#" onClick={this.logout.bind(this)}>
              {t("logout")}
            </Link>
          </li>
        </ul>
      </div>
    );

    const userIsAuthenticatedAndAdmin = (
      <div className={collapseClass} id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard" onClick={() => this.setState({ isNavOpen: false })}>
              <i className="far fa-list-alt"></i> {t("yourIssues")}
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto align-items-center">
          {langToggleBtn}
          <li className="nav-item">
            <Link className="nav-link" to="/editUser" onClick={() => this.setState({ isNavOpen: false })}>
              <i className="fas fa-user-circle mr-1" /> {user.username}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/" onClick={() => this.setState({ isNavOpen: false })}>
              {t("adminPanel")}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#" onClick={this.logout.bind(this)}>
              {t("logout")}
            </Link>
          </li>
        </ul>
      </div>
    );

    const userIsAuthenticatedAndOwner = (
      <div className={collapseClass} id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard" onClick={() => this.setState({ isNavOpen: false })}>
              <i className="far fa-list-alt"></i> {t("yourIssues")}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/workshop/dashboard" onClick={() => this.setState({ isNavOpen: false })}>
              <i className="fas fa-warehouse"></i> {t("workshopManagement")}
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto align-items-center">
          {langToggleBtn}
          <li className="nav-item">
            <Link className="nav-link" to="/editUser" onClick={() => this.setState({ isNavOpen: false })}>
              <i className="fas fa-user-circle mr-1" /> {user.username}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#" onClick={this.logout.bind(this)}>
              {t("logout")}
            </Link>
          </li>
        </ul>
      </div>
    );

    const userIsNotAuthenticated = (
      <div className={collapseClass} id="mobile-nav">
        <ul className="navbar-nav ml-auto align-items-center">
          {langToggleBtn}
          <li className="nav-item">
            <Link className="nav-link" to="/register" onClick={() => this.setState({ isNavOpen: false })}>
              <i className="fas fa-user-plus mr-1" />
              {t("signUp")}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login" onClick={() => this.setState({ isNavOpen: false })}>
              {t("login")}
            </Link>
          </li>
        </ul>
      </div>
    );

    let headerLinks;

    if (validToken && user) {
      headerLinks = userIsAuthenticated;

      //Refresh, po expirationTime wyrzuca uzytkownika
      setTimeout(function() {
        window.location.reload();
      }, (user.exp - Date.now() / 1000) * 1000);

      const roles = user.roles || [];
      if (roles.some(e => e.authority === "ROLE_ADMIN" || e.name === "ADMIN" || e.role === "ADMIN")) {
        headerLinks = userIsAuthenticatedAndAdmin;
      } else if (roles.some(e => e.authority === "ROLE_WORKSHOPOWNER" || e.name === "WORKSHOPOWNER" || e.role === "WORKSHOPOWNER")) {
        headerLinks = userIsAuthenticatedAndOwner;
      }
    } else {
      headerLinks = userIsNotAuthenticated;
    }

    return (
      <nav
        className="navbar navbar-expand-sm navbar-dark mb-4"
        style={{
          backgroundColor: "#272e38",
          borderBottom: "3px solid #e74c3c"
        }}
      >
        <div className="container">
          <Link className="navbar-brand font-weight-bold" to="/">
            <i className="fas fa-wrench"></i> {t("appName")}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleNav}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          {headerLinks}
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(
  mapStateToProps,
  { logout }
)(Header);
