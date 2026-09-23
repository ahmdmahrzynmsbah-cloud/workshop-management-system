import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteIssue } from "../../actions/issueActions";
import { t } from "../../i18n/translations";

class IssueItem extends Component {
  onDeleteClick = id => {
    if (window.confirm(t("confirmDelete"))) {
      this.props.deleteIssue(id);
    }
  };

  render() {
    const { issue } = this.props;
    const issueId = issue.issueId || issue.id;

    let statusText = issue.status;
    let statusBadgeClass = "badge badge-secondary";
    if (issue.status === "TO DO") {
      statusText = t("statusToDo");
      statusBadgeClass = "badge badge-danger";
    } else if (issue.status === "IN PROGRESS") {
      statusText = t("statusInProgress");
      statusBadgeClass = "badge badge-warning text-dark";
    } else if (issue.status === "DONE") {
      statusText = t("statusDone");
      statusBadgeClass = "badge badge-success";
    }

    const workshopId = issue.acceptedOffer
      ? issue.acceptedOffer.offeredByWorkshopId || issue.acceptedOffer.workshop?.id || 1
      : 1;

    return (
      <div className="container px-0">
        <div className="card card-body bg-white mb-3 shadow-sm border-0" style={{ borderRadius: "8px" }}>
          <div className="row align-items-center" style={{ minHeight: "120px" }}>
            <div className="col-lg-3 col-md-3 text-center mb-2 mb-md-0">
              <span className={`${statusBadgeClass} p-2 font-weight-bold d-inline-block`} style={{ fontSize: "13px", borderRadius: "4px" }}>
                {statusText}
              </span>
              <div className="mt-2 text-muted" style={{ fontSize: "13px" }}>
                <i className="far fa-calendar-alt mr-1"></i> {issue.creationDate || "اليوم"}
              </div>
              <div className="mt-1">
                <span className="badge badge-light border text-muted" style={{ fontSize: "12px" }}>
                  {t("issueType")}: {issue.type || issue.category || "عام"}
                </span>
              </div>
            </div>
            <div className="col-lg-5 col-md-5 col-12 mb-3 mb-md-0">
              <h4 className="font-weight-bold text-dark mb-1">{issue.carModel || issue.title}</h4>
              <p className="text-secondary mb-0" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {issue.description}
              </p>
              {issue.localization && (
                <small className="text-muted d-block mt-1">
                  <i className="fas fa-map-marker-alt text-danger mr-1"></i> {issue.localization}
                </small>
              )}
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="d-flex flex-column gap-2">
                <Link
                  to={`/issueBoard/${issueId}`}
                  className="btn btn-outline-primary btn-sm btn-block text-left mb-2 font-weight-bold shadow-sm"
                  style={{ borderRadius: "6px", padding: "8px 12px" }}
                >
                  <i className="fa fa-flag-checkered mr-2"> </i> {t("issueBoard")}
                </Link>
                {issue.status === "TO DO" && (
                  <>
                    <Link
                      to={`/updateIssue/${issueId}`}
                      className="btn btn-outline-info btn-sm btn-block text-left mb-2 font-weight-bold shadow-sm"
                      style={{ borderRadius: "6px", padding: "8px 12px" }}
                    >
                      <i className="fa fa-edit mr-2"></i> {t("updateIssue")}
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm btn-block text-left font-weight-bold shadow-sm"
                      onClick={() => this.onDeleteClick(issueId)}
                      style={{ borderRadius: "6px", padding: "8px 12px" }}
                    >
                      <i className="fa fa-trash mr-2"></i> {t("deleteIssue")}
                    </button>
                  </>
                )}
                {issue.status === "DONE" && issue.opinioned === false && (
                  <Link
                    to={`/workshopProfile/${workshopId}`}
                    className="btn btn-outline-warning btn-sm btn-block text-left font-weight-bold shadow-sm text-dark"
                    style={{ borderRadius: "6px", padding: "8px 12px", backgroundColor: "#fff8e1" }}
                  >
                    <i className="far fa-star text-warning mr-2"></i> {t("rateWorkshop")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

IssueItem.propTypes = {
  deleteIssue: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteIssue }
)(IssueItem);
