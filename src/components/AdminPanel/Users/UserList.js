import React, { Component } from "react";
import UserItem from "./UserItem";
import { connect } from "react-redux";
import { getPagedUsers } from "../../../actions/adminActions";
import PropTypes from "prop-types";
import "./UserList.css";
import { Link } from "react-router-dom";

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {},
      pageNo: 0,
      totalPages: 0,
      usersInOnePage: 5
    };

    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    this.props.getPagedUsers(this.state.usersInOnePage, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      this.setState({
        users: nextProps.users.content,
        pageNo: nextProps.users.number,
        totalPages: nextProps.users.totalPages
      });
    }
  }

  generatePagination(pageNo, totalPages) {
    let arr = [];

    arr.push(
      <Link
        key="prev"
        to="#"
        onClick={e => {
          e.preventDefault();
          this.changePage(0);
        }}
      >
        &laquo;{" "}
      </Link>
    );

    for (let i = 0; i < totalPages; i++) {
      if (i === pageNo) {
        arr.push(
          <Link
            key={i}
            to="#"
            className="active"
            onClick={e => {
              e.preventDefault();
              this.changePage(i);
            }}
          >
            {i + 1}{" "}
          </Link>
        );
      } else {
        arr.push(
          <Link
            key={i}
            to="#"
            onClick={e => {
              e.preventDefault();
              this.changePage(i);
            }}
          >
            {i + 1}
          </Link>
        );
      }
    }

    arr.push(
      <Link
        key="next"
        to="#"
        onClick={e => {
          e.preventDefault();
          this.changePage(Math.max(0, totalPages - 1));
        }}
      >
        {" "}
        &raquo;
      </Link>
    );

    return arr;
  }

  changePage(pageNo) {
    this.props.getPagedUsers(this.state.usersInOnePage, pageNo);
  }

  render() {
    const { users } = this.props.adminPanel;
    return (
      <div className="container">
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <div className="row">
          <div className="col-lg-12">
            <div className="main-box clearfix">
              <div className="table-responsive">
                <Link to="/admin/" className="float-left">
                  Back
                </Link>

                <table className="table user-list">
                  <thead>
                    <tr>
                      <th>
                        <span>User</span>
                      </th>
                      <th>
                        <span>Created</span>
                      </th>
                      <th>
                        <span>Updated</span>
                      </th>
                      <th className="text-center">
                        <span>Issues</span>
                      </th>
                      <th className="text-center">
                        <span>Shops</span>
                      </th>
                      <th>
                        <span>Username/Email</span>
                      </th>
                      <th>
                        <span>Options</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users?.content || []).map(user => (
                      <UserItem key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
                <ul className="pull-right text-center">
                  <span style={{ fontSize: "13px", color: "grey" }}>
                    Page: {(users?.number || 0) + 1} of {users?.totalPages || 1}
                  </span>
                  <br />
                  <span>{this.generatePagination(users?.number || 0, users?.totalPages || 1)}</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserList.propTypes = {
  adminPanel: PropTypes.object.isRequired,
  getPagedUsers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  adminPanel: state.adminPanel
});

export default connect(
  mapStateToProps,
  { getPagedUsers }
)(UserList);
