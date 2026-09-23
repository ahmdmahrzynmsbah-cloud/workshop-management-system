import React, { Component } from "react";
import { deleteUser } from "../../../actions/adminActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UserItem extends Component {
  onDeleteClick = id => {
    this.props.deleteUser(id);
  };

  render() {
    const { user } = this.props;
    if (!user) return null;

    let roleCheck = "USER";
    let avatar =
      "https://cdn0.iconfinder.com/data/icons/flat-design-business-set-3/24/people-customer-unknown-512.png";

    const roles = user.roles || [];
    if (roles.some(e => e.name === "ADMIN" || e.role === "ADMIN" || e.authority === "ROLE_ADMIN")) {
      roleCheck = "ADMIN";
      avatar =
        "https://icon-library.net/images/administrator-icon/administrator-icon-19.jpg";
    } else if (roles.some(e => e.name === "WORKSHOPOWNER" || e.role === "WORKSHOPOWNER" || e.authority === "ROLE_WORKSHOPOWNER")) {
      roleCheck = "WORKSHOP OWNER";
      avatar =
        "https://cdn2.iconfinder.com/data/icons/plumbing-service-bathroom-glyph/64/07_plumber-mechanic-man-repair-512.png";
    }

    const issuesCount = user.issues ? user.issues.length : 0;
    const workshopsCount = user.workshops ? user.workshops.length : 0;

    return (
      <tr>
        <td>
          <img src={avatar} alt="" />
          <Link to={`/admin/userProfile/${user.id}`} className="user-link">
            {user.fullName}
          </Link>
          <span className="user-subhead">{roleCheck}</span>
        </td>
        <td>{user.create_At || user.created_At}</td>
        <td>{user.update_At || user.updated_At}</td>
        <td className="text-center">
          <span className="label label-default">{issuesCount}</span>
        </td>
        <td className="text-center">
          <span className="label label-default">{workshopsCount}</span>
        </td>
        <td>
          <Link to={`/admin/userProfile/${user.id}`}>{user.username}</Link>
        </td>
        <td style={{ width: "10%" }}>
          <Link to={`/admin/editUser/${user.id}`} className="table-link mr-1">
            <span className="fa-stack">
              <i className="fa fa-square fa-stack-2x"></i>
              <i className="fa fa-pencil fa-stack-1x fa-inverse"></i>
            </span>
          </Link>
          <button
            type="button"
            className="table-link danger btn btn-link p-0"
            onClick={() => this.onDeleteClick(user.id)}
            title="Delete user"
          >
            <span className="fa-stack">
              <i className="fa fa-square fa-stack-2x" style={{ color: "#e74c3c" }}></i>
              <i className="fa fa-trash-o fa-stack-1x fa-inverse"></i>
            </span>
          </button>
        </td>
      </tr>
    );
  }
}

UserItem.propTypes = {
  deleteUser: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteUser }
)(UserItem);
