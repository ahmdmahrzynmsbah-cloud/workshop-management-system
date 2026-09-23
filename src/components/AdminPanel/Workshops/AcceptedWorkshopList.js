import React, { Component } from "react";
import "./WorkshopList.css";
import AcceptedWorkshopItem from "./AcceptedWorkshopItem";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getPagedAcceptedWorkshops } from "../../../actions/adminActions";

class AcceptedWorkshopList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      workshops: {},
      pageNo: 0,
      totalPages: 0,
      workshopsInOnePage: 5
    };

    this.changePage = this.changePage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshops) {
      this.setState({
        workshops: nextProps.workshops.content,
        pageNo: nextProps.workshops.number,
        totalPages: nextProps.workshops.totalPages
      });
    }
  }

  componentDidMount() {
    this.props.getPagedAcceptedWorkshops(this.state.workshopsInOnePage, 0);
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
    this.props.getPagedAcceptedWorkshops(this.state.workshopsInOnePage, pageNo);
  }

  render() {
    const { workshops } = this.props.adminPanel;

    let workshopss;
    let acceptedWorkshops = [];
    if (workshops.content !== undefined) {
      workshopss = workshops.content.map(workshop => (
        <AcceptedWorkshopItem key={workshop.id} workshop={workshop} />
      ));

      for (let i = 0; i < workshopss.length; i++) {
        if (workshopss[i].props.workshop.accepted === true) {
          acceptedWorkshops.push(workshopss[i]);
        }
      }
    }
    return (
      <div className="container">
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <div className="row">
          <div className="col-lg-12">
            <Link to="/admin/" className="float-left">
              Back
            </Link>
            <h3 className="text-center">
              Accepted workshops ({workshops.totalElements})
            </h3>
            <div className="main-box clearfix">
              <div className="table-responsive">
                <table className="table user-list">
                  <thead>
                    <tr>
                      <th>
                        <span>Workshop name</span>
                      </th>
                      <th>
                        <span>Description</span>
                      </th>
                      <th>
                        <span>Applied at</span>
                      </th>
                      <th className="text-center">
                        <span>Phone #</span>
                      </th>
                      <th className="text-center">
                        <span>Accepted</span>
                      </th>
                      <th>
                        <span>Owner</span>
                      </th>
                      <th>
                        <span>Options</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>{acceptedWorkshops}</tbody>
                </table>
              </div>
              <ul className="pull-right text-center">
                <span style={{ fontSize: "13px", color: "grey" }}>
                  Page: {(workshops?.number || 0) + 1} of {workshops?.totalPages || 1}
                </span>
                <br />
                <span>{this.generatePagination(workshops?.number || 0, workshops?.totalPages || 1)}</span>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AcceptedWorkshopList.propTypes = {
  adminPanel: PropTypes.object.isRequired,
  getPagedAcceptedWorkshops: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  adminPanel: state.adminPanel
});

export default connect(
  mapStateToProps,
  { getPagedAcceptedWorkshops }
)(AcceptedWorkshopList);
