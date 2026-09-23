import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  banOpinion,
  unbanOpinion,
  unreportOpinion
} from "../../../actions/adminActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ReportedOpinionItem extends Component {
  onBanClick = opinionId => {
    this.props.banOpinion(opinionId);
  };

  onUnbanClick = opinionId => {
    this.props.unbanOpinion(opinionId);
  };

  onUnreportClick = opinionId => {
    this.props.unreportOpinion(opinionId);
  };

  render() {
    const { opinion } = this.props;

    let banOrUnbanCheck;
    let unreportCheck;
    if (opinion.banned === false && opinion.reported === true) {
      unreportCheck = (
        <Link
          to="#"
          className="total-like"
          style={{
            color: "#45a0bd",
            height: "30px",
            lineHeight: "30px",
            marginBottom: "1px"
          }}
          onClick={e => {
            e.preventDefault();
            this.onUnreportClick(opinion.opinionId);
          }}
        >
          <i className="far fa-flag"></i> Unreport
        </Link>
      );
    }
    if (opinion.banned === false) {
      banOrUnbanCheck = (
        <Link
          to="#"
          className="total-like"
          style={{ color: "red", height: "30px", lineHeight: "30px" }}
          onClick={e => {
            e.preventDefault();
            this.onBanClick(opinion.opinionId);
          }}
        >
          <i className="fas fa-ban"></i> Ban
        </Link>
      );
    } else {
      banOrUnbanCheck = (
        <Link
          to="#"
          className="total-like"
          style={{ color: "red", height: "30px", lineHeight: "30px" }}
          onClick={e => {
            e.preventDefault();
            this.onUnbanClick(opinion.opinionId);
          }}
        >
          <i className="fas fa-ban"></i> Unban
        </Link>
      );
    }

    const userName = opinion.user?.fullName || opinion.user?.username || "Anonymous";
    const userId = opinion.user?.id || 1;
    const issueTitle = opinion.issue?.title || "Issue";
    const carModel = opinion.issue?.carModel ? ` (${opinion.issue.carModel})` : "";
    const issueId = opinion.issue?.issueId || opinion.opinionedByIssueId || 1;
    const score = opinion.rate ?? opinion.score ?? 5;

    return (
      <tr>
        <td>
          <img
            src="https://c7.uihere.com/icons/373/764/998/chat-communication-conversation-discuss-message-speech-talk-icon-34c85b65867c25b8b154fb23a1f99a63.png"
            alt=""
          />
          <Link
            to={`/admin/userProfile/${userId}`}
            className="user-link"
          >
            {userName}
          </Link>
          <span className="user-subhead">
            <b>Issue: </b>
            <Link
              to={`/issueBoard/${issueId}`}
              style={{ color: "gray" }}
            >
              {issueTitle}{carModel}
            </Link>
          </span>
        </td>
        <td style={{ color: "gray", fontSize: "12px", maxWidth: "300px" }}>
          <i>"{opinion.description}"</i>
        </td>
        <td className="text-center" style={{ width: "130px" }}>
          <span className="label label-default">
            <div style={{ color: "orange", fontSize: "18px" }}>
              <i
                className={score >= 1 ? "fas fa-star" : "far fa-star"}
              ></i>
              <i
                className={score >= 2 ? "fas fa-star" : "far fa-star"}
              ></i>
              <i
                className={score >= 3 ? "fas fa-star" : "far fa-star"}
              ></i>
              <i
                className={score >= 4 ? "fas fa-star" : "far fa-star"}
              ></i>
              <i
                className={score >= 4.5 ? "fas fa-star" : "far fa-star"}
              ></i>
            </div>
          </span>
        </td>
        <td className="text-center" style={{ width: "60px" }}>
          <span
            className={
              opinion.banned === false
                ? "badge badge-success"
                : "badge badge-danger"
            }
          >
            {(opinion.banned ?? false).toString()}
          </span>
        </td>
        <td className="text-center" style={{ width: "13%" }}>
          {unreportCheck}
          {banOrUnbanCheck}
        </td>
      </tr>
    );
  }
}

ReportedOpinionItem.propTypes = {
  banOpinion: PropTypes.func.isRequired,
  unbanOpinion: PropTypes.func.isRequired,
  unreportOpinion: PropTypes.func.isRequired
};

export default connect(
  null,
  { banOpinion, unbanOpinion, unreportOpinion }
)(ReportedOpinionItem);
