import React from "react";
import { Link } from "react-router-dom";
import { t } from "../../i18n/translations";

const CreateIssueButton = () => {
  return (
    <React.Fragment>
      <Link
        to="/addIssue"
        className="btn btn-lg btn-danger float-right font-weight-bold shadow-sm"
        style={{ backgroundColor: "#e74c3c" }}
      >
        <i className="fas fa-plus-circle mr-1"></i> {t("createIssue")}
      </Link>
    </React.Fragment>
  );
};
export default CreateIssueButton;
