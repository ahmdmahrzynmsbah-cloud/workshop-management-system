import React, { Component } from "react";
import IssueItem from "./Issue/IssueItem";
import CreateIssueButton from "./Issue/CreateIssueButton";
import { connect } from "react-redux";
import { getIssues } from "../actions/issueActions";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./dashboard.css";
import { getUser } from "../actions/userActions";
import { t, subscribeLanguage } from "../i18n/translations";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: "ALL"
    };
  }

  componentDidMount() {
    this.props.getUser();
    this.props.getIssues();
    this.unsubscribe = subscribeLanguage(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setActiveTab = tab => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { issues } = this.props.issue;
    const { user } = this.props.actualUser;
    const { activeTab } = this.state;

    let userWithoutWorkshop;

    const roles = (user && user.roles) || [];
    if (!roles.some(e => e.name === "WORKSHOPOWNER" || e.authority === "ROLE_WORKSHOPOWNER" || e.role === "WORKSHOPOWNER")) {
      userWithoutWorkshop = (
        <div
          className="notice notice-success text-center mb-3"
          style={{
            fontSize: "14px",
            color: "#2c3e50",
            backgroundColor: "#e8f8f5",
            padding: "10px",
            borderRadius: "6px"
          }}
        >
          هل تملك ورشة صيانة سيارات؟ <Link to="/workshop/AddWorkshop" className="font-weight-bold text-success">أضف ورشتك الآن</Link> وابدأ في استقبال طلبات العملاء!
        </div>
      );
    }

    // Filter issues by status
    const issuesList = issues || [];
    const issuesAll = issuesList.map(issue => (
      <IssueItem key={issue.issueId || issue.id} issue={issue} />
    ));
    let toDoIssues = [],
      inProgressIssues = [],
      doneIssues = [];
    for (let i = 0; i < issuesAll.length; i++) {
      const itemStatus = issuesAll[i].props.issue?.status;
      if (itemStatus === "TO DO") {
        toDoIssues.push(issuesAll[i]);
      } else if (itemStatus === "IN PROGRESS") {
        inProgressIssues.push(issuesAll[i]);
      } else {
        doneIssues.push(issuesAll[i]);
      }
    }

    let displayedIssues = issuesAll;
    if (activeTab === "TODO") displayedIssues = toDoIssues;
    else if (activeTab === "IN_PROGRESS") displayedIssues = inProgressIssues;
    else if (activeTab === "DONE") displayedIssues = doneIssues;

    let emptyMessage = t("noIssuesFound");
    if (activeTab === "TODO") emptyMessage = "لا توجد طلبات قيد الانتظار حالياً";
    else if (activeTab === "IN_PROGRESS") emptyMessage = "لا توجد طلبات قيد التنفيذ حالياً";
    else if (activeTab === "DONE") emptyMessage = "لا توجد طلبات مكتملة حالياً";

    return (
      <div className="content">
        <div className="container">
          {userWithoutWorkshop}
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h1 className="display-4 font-weight-bold mb-0">
                  {t("yourIssues")}
                </h1>
                <CreateIssueButton />
              </div>

              <nav>
                <div
                  className="nav nav-tabs nav-fill shadow-sm"
                  id="nav-tab"
                  role="tablist"
                  style={{ backgroundColor: "#ffffff", borderRadius: "8px 8px 0 0" }}
                >
                  <button
                    type="button"
                    className={`nav-item nav-link font-weight-bold border-0 ${activeTab === "ALL" ? "active bg-light" : ""}`}
                    onClick={() => this.setActiveTab("ALL")}
                    style={{ cursor: "pointer", borderBottom: activeTab === "ALL" ? "3px solid #e74c3c" : "none" }}
                  >
                    {t("allIssues")}{" "}
                    <span className="badge badge-dark ml-1">
                      {issuesAll.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`nav-item nav-link font-weight-bold border-0 ${activeTab === "TODO" ? "active bg-light" : ""}`}
                    onClick={() => this.setActiveTab("TODO")}
                    style={{ cursor: "pointer", borderBottom: activeTab === "TODO" ? "3px solid #e74c3c" : "none" }}
                  >
                    {t("statusToDo")}{" "}
                    <span className="badge badge-danger ml-1">
                      {toDoIssues.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`nav-item nav-link font-weight-bold border-0 ${activeTab === "IN_PROGRESS" ? "active bg-light" : ""}`}
                    onClick={() => this.setActiveTab("IN_PROGRESS")}
                    style={{ cursor: "pointer", borderBottom: activeTab === "IN_PROGRESS" ? "3px solid #e74c3c" : "none" }}
                  >
                    {t("statusInProgress")}{" "}
                    <span className="badge badge-warning text-dark ml-1">
                      {inProgressIssues.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`nav-item nav-link font-weight-bold border-0 ${activeTab === "DONE" ? "active bg-light" : ""}`}
                    onClick={() => this.setActiveTab("DONE")}
                    style={{ cursor: "pointer", borderBottom: activeTab === "DONE" ? "3px solid #e74c3c" : "none" }}
                  >
                    {t("statusDone")}{" "}
                    <span className="badge badge-success ml-1">
                      {doneIssues.length}
                    </span>
                  </button>
                </div>
              </nav>
              <div className="tab-content px-sm-0 mt-3">
                {displayedIssues.length > 0 ? (
                  displayedIssues
                ) : (
                  <div className="alert alert-warning text-center" role="alert">
                    {emptyMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  issue: PropTypes.object.isRequired,
  getIssues: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  issue: state.issue,
  actualUser: state.actualUser,
  security: state.security
});

export default connect(
  mapStateToProps,
  { getIssues, getUser }
)(Dashboard);
