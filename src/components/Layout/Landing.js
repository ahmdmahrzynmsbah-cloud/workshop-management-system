import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { t, subscribeLanguage } from "../../i18n/translations";

class Landing extends Component {
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

  render() {
    return (
      <div className="landing">
        <div className="light-overlay landing-inner text-dark">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-4 font-weight-bold mb-4">{t("landingTitle")}</h1>
                <p className="lead mx-auto" style={{ maxWidth: "700px", lineHeight: "1.8" }}>
                  {t("landingSubtitle")}
                </p>
                <hr className="my-4" />
                <div className="d-flex justify-content-center flex-wrap gap-2">
                  <Link
                    className="btn btn-lg m-2 font-weight-bold shadow-sm"
                    style={{ backgroundColor: "#e74c3c", color: "white", padding: "12px 28px" }}
                    to="/register"
                  >
                    <i className="fas fa-user-plus mr-2"></i> {t("signUp")}
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-lg btn-dark m-2 font-weight-bold shadow-sm"
                    style={{ padding: "12px 28px" }}
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i> {t("login")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(mapStateToProps)(Landing);
