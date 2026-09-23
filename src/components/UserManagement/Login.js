import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { login } from "../../actions/securityActions";
import { t, subscribeLanguage } from "../../i18n/translations";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.security.validToken) {
      this.props.history.push("/dashboard");
    }
    this.unsubscribe = subscribeLanguage(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.security.validToken) {
      this.props.history.push("/dashboard");
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const LoginRequest = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.login(LoginRequest);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center font-weight-bold">{t("loginTitle")}</h1>
              <p className="lead text-center text-muted">{t("tagline")}</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label className="font-weight-bold">{t("username")}</label>
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.username
                    })}
                    placeholder={t("username")}
                    name="username"
                    value={this.state.username}
                    onChange={this.onChange}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="font-weight-bold">{t("password")}</label>
                  <input
                    type="password"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.password
                    })}
                    placeholder={t("password")}
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <input
                  type="submit"
                  value={t("submitLogin")}
                  className="btn btn-danger btn-block mt-4 btn-lg font-weight-bold"
                  style={{ backgroundColor: "#e74c3c" }}
                />
              </form>

              <div className="card mt-4 shadow-sm border-0" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="card-body">
                  <h6 className="card-title font-weight-bold text-muted mb-3">حسابات تجريبية سريعة (Demo Accounts):</h6>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark mr-2 mb-2"
                      onClick={() => this.setState({ username: "admin@carsmechanic.com", password: "password123" })}
                    >
                      <i className="fas fa-user-shield mr-1"></i> الإدارة (admin@carsmechanic.com)
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary mr-2 mb-2"
                      onClick={() => this.setState({ username: "owner@autofix.com", password: "password123" })}
                    >
                      <i className="fas fa-warehouse mr-1"></i> صاحب ورشة (owner@autofix.com)
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success mb-2"
                      onClick={() => this.setState({ username: "john@example.com", password: "password123" })}
                    >
                      <i className="fas fa-user mr-1"></i> عميل (john@example.com)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
