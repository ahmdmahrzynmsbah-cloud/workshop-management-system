import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./adminDashboard.css";
import { connect } from "react-redux";
import {
  getPagedUsers,
  getWorkshops,
  getReportedOpinions
} from "../../actions/adminActions";
import PropTypes from "prop-types";

var divStyle = {
  marginTop: 50
};

class adminDashboard extends Component {
  componentDidMount() {
    this.props.getPagedUsers(10000, 0);
    this.props.getWorkshops();
    this.props.getReportedOpinions();
  }
  render() {
    let pendingWorkshops = 0;
    let acceptedWorkshops = 0;
    const { users } = this.props.adminPanel;
    const { workshops } = this.props.adminPanel;
    const { opinions } = this.props.opinion;

    for (let i = 0; i < workshops.length; i++) {
      if (workshops[i].accepted === false) pendingWorkshops++;
      else if (workshops[i].accepted === true) acceptedWorkshops++;
    }

    let [admins, workshopowners, userss] = [0, 0, 0];
    const userList = (users && users.content) || [];
    for (let x = 0; x < userList.length; x++) {
      const uRoles = userList[x].roles || [];
      if (uRoles.some(e => e.name === "ADMIN" || e.authority === "ROLE_ADMIN" || e.role === "ADMIN" || e === "ADMIN")) admins++;
      else if (uRoles.some(e => e.name === "WORKSHOPOWNER" || e.authority === "ROLE_WORKSHOPOWNER" || e.role === "WORKSHOPOWNER" || e === "WORKSHOPOWNER"))
        workshopowners++;
      else if (uRoles.some(e => e.name === "USER" || e.authority === "ROLE_USER" || e.role === "USER" || e === "USER")) userss++;
    }

    return (
      <div className="container" style={divStyle}>
        <div className="row">
          <div className="col-md-4 col-xl-4">
            <Link to={`/admin/userList`}>
              <div className="card bg-c-blue order-card">
                <div className="card-block">
                  <h5 className="m-b-20">Users management</h5>
                  <h3 className="text-right">
                    <i className="fa fa-users f-left"></i>
                    <span>{users.content.length}</span>
                  </h3>
                  <br />
                  <p style={{ marginBottom: "2px" }}>
                    Administrators
                    <span className="f-right">{admins}</span>
                  </p>
                  <p style={{ marginBottom: "2px" }}>
                    Workshop owners
                    <span className="f-right">{workshopowners}</span>
                  </p>
                  <p>
                    Users
                    <span className="f-right">{userss}</span>
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-xl-4">
            <div className="card bg-c-green order-card">
              <div className="card-block">
                <h5 className="m-b-20">Workshop management</h5>
                <h2 className="text-right">
                  <i className="fa fa-warehouse f-left"></i>
                  <span>{workshops.length}</span>
                </h2>
                <br></br>
                <Link to="/admin/pendingWorkshopList" style={{ color: "#FFF" }}>
                  <p className="m-b-0">
                    Pending workshops
                    <span className="f-right">{pendingWorkshops}</span>
                  </p>
                </Link>
                <Link
                  to="/admin/acceptedWorkshopList"
                  style={{ color: "#FFF" }}
                >
                  <p className="m-b-0">
                    Accepted workhops
                    <span className="f-right">{acceptedWorkshops}</span>
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-xl-4">
            <div className="card bg-c-yellow order-card">
              <div className="card-block">
                <h5 className="m-b-20">Opinions</h5>
                <h2 className="text-right">
                  <i className="fas fa-star-half-alt f-left"></i>
                  <span>{opinions.length}</span>
                </h2>
                <br></br>
                <Link to="/admin/reportedOpinions" style={{ color: "#FFF" }}>
                  <p className="m-b-0">
                    Reported reviews
                    <span className="f-right">
                      {
                        opinions.filter(
                          item =>
                            item.reported === true && item.banned === false
                        ).length
                      }
                    </span>
                  </p>
                </Link>
                <Link to="/admin/bannedOpinions" style={{ color: "#FFF" }}>
                  <p className="m-b-0">
                    Banned reviews
                    <span className="f-right">
                      {opinions.filter(item => item.banned === true).length}
                    </span>
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/*<div className="col-md-4 col-xl-3">
            <div className="card bg-c-pink order-card">
              <div className="card-block">
                <h6 className="m-b-20">Orders Received</h6>
                <h2 className="text-right">
                  <i className="fa fa-credit-card f-left"></i>
                  <span>486</span>
                </h2>
                <p className="m-b-0">
                  Completed Orders<span className="f-right">351</span>
                </p>
              </div>
            </div>
    </div>*/}
        </div>
      </div>
    );
  }
}

adminDashboard.propTypes = {
  adminPanel: PropTypes.object.isRequired,
  getPagedUsers: PropTypes.func.isRequired,
  getWorkshops: PropTypes.func.isRequired,
  getReportedOpinions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  adminPanel: state.adminPanel,
  opinion: state.opinion
});

export default connect(
  mapStateToProps,
  { getPagedUsers, getWorkshops, getReportedOpinions }
)(adminDashboard);
