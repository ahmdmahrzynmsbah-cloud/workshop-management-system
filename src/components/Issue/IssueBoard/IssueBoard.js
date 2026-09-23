import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getIssue,
  deleteIssue,
  markAsDone
} from "../../../actions/issueActions";
import { getOffersByIssue } from "../../../actions/offerActions";
import "./IssueBoard.css";
import { Link } from "react-router-dom";
import OfferItem from "./OfferItem";

class IssueBoard extends Component {
  onDeleteClick = async id => {
    await this.props.deleteIssue(id);
    this.props.history.push("/dashboard");
  };

  onMarkDoneClick = async id => {
    await this.props.markAsDone(id);
    const { id: issueId } = this.props.match.params;
    this.props.getIssue(issueId, this.props.history);
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getIssue(id, this.props.history);
    this.props.getOffersByIssue(id, this.props.history);
  }

  render() {
    const { issue } = this.props.issue;
    const { user } = this.props.security;
    const { offers } = this.props.offer;

    //logo checking
    let logo;
    if (issue.carModel !== undefined) {
      if (issue.carModel.toLowerCase().includes("audi"))
        logo = "http://www.androla.pl/images/60454.jpg";
      else if (issue.carModel.toLowerCase().includes("peugeot"))
        logo =
          "https://www.carsbase.com/cache/storage/catalog/logos/40-gthumb-gwdata128-ghdata128.jpg";
      else if (issue.carModel.toLowerCase().includes("nissan"))
        logo =
          "https://i.pinimg.com/236x/95/00/28/950028c68d92185270fab74a91e9b443--car-logos-car-brands-logos.jpg";
      else if (issue.carModel.toLowerCase().includes("bmw"))
        logo = "https://cdn.iconscout.com/icon/free/png-256/bmw-5-202750.png";
      else if (issue.carModel.toLowerCase().includes("fiat"))
        logo = "https://www.freeiconspng.com/uploads/fiat-logo-icon-png-3.png";
      else if (issue.carModel.toLowerCase().includes("daewoo"))
        logo = "https://www.iconninja.com/ico/128/daewoo-602113.ico";
      else if (issue.carModel.toLowerCase().includes("renault"))
        logo =
          "https://cdn.breakerlink.com/images/car_logos/JPG/256/min/renault-min.jpg";
      else if (issue.carModel.toLowerCase().includes("honda"))
        logo =
          "https://cdn.breakerlink.com/images/car_logos/JPG/256/min/honda-min.jpg";
      else if (issue.carModel.toLowerCase().includes("toyota"))
        logo = "https://cdn.iconscout.com/icon/free/png-256/toyota-202913.png";
      else if (issue.carModel.toLowerCase().includes("mercedes"))
        logo =
          "https://cdn.iconscout.com/icon/free/png-256/mercedes-8-202855.png";
      else {
        logo = "https://img.icons8.com/nolan/2x/car.png";
      }
    }

    //alert assignedTo empty
    let assignedTo = (
      <div className="alert alert-warning text-center" role="alert">
        This issue doesn't have any accepted offer yet
      </div>
    );

    //assignedTo
    let acceptedCheck;
    let doneButtonCheck;

    if (issue.acceptedOffer != null) {
      //show markAsDone button if acceptedOffer is by loggedUser and status isnt done
      if (
        issue.acceptedOffer.offeredByUser === user.username &&
        issue.status !== "DONE"
      ) {
        doneButtonCheck = (
          <div className="card-hover-show">
            <Link
              to="#"
              className="btn btn-xs fs-10 btn-bold btn-success"
              onClick={e => {
                e.preventDefault();
                this.onMarkDoneClick(issue.issueId);
              }}
            >
              Change status to DONE
            </Link>
          </div>
        );
      }

      acceptedCheck = { pointerEvents: "none", opacity: "0.4" };
      assignedTo = (
        <div className="assign-team">
          <div className="card b-1 hover-shadow mb-20">
            <div className="media card-body" style={{ padding: "0.9rem" }}>
              <div className="media-left pr-12">
                <img
                  className="avatar avatar-xl no-radius"
                  src="https://cdn2.iconfinder.com/data/icons/mechanic-light/64/tools_repair_mechanican_car_repair_garage_car_workshop-512.png"
                  alt="..."
                />
              </div>
              <div className="media-body">
                <div>
                  <Link
                    to={`/workshopProfile/${issue.acceptedOffer.workshop.id}`}
                  >
                    <span className="fs-20 pr-16">
                      {issue.acceptedOffer.workshop.name}
                    </span>
                  </Link>
                </div>

                <small>
                  <b>Owner</b>: {issue.acceptedOffer.workshop.owner}
                </small>
                <br />
                <small>
                  <b>Phone number</b>: {issue.acceptedOffer.workshop.telephone}
                </small>
              </div>
              <div className="media-right text-right d-none d-md-block">
                <p className="fs-14 text-fade mb-12">
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  {issue.acceptedOffer.workshop.address}
                </p>
                <p className="fs-14 text-fade mb-12">
                  <i className="fas fa-money-bill"></i> Price: $
                  {issue.acceptedOffer.price}
                </p>
              </div>
            </div>
            <footer className="card-footer flexbox align-items-center">
              <div style={{ fontSize: "13px" }}>
                <strong>Repair planned on:</strong>{" "}
                <span>{issue.acceptedOffer.preferedDate}</span> <br />
                <strong>Estimated repair time:</strong>{" "}
                <span>{issue.acceptedOffer.estTime} days</span>
              </div>
              {doneButtonCheck}
            </footer>
          </div>
        </div>
      );
    }

    const offerss = offers.map(offer => (
      <OfferItem key={offer.offerId} offer={offer} />
    ));

    //if role WORKSHOPOWNER then see plus button
    //and dont see plus, if already has offered or issue owner is logged user
    let addOfferCheck;
    const roles = user?.roles || [];
    if (
      roles.some(e => e.authority === "ROLE_WORKSHOPOWNER" || e.name === "WORKSHOPOWNER" || e.role === "WORKSHOPOWNER") &&
      offers.some(e => e.offeredByUser === user?.username) === false &&
      issue.issueLeader !== user?.username
    ) {
      addOfferCheck = (
        <Link
          to={`/addOffer/${issue.issueId}`}
          className="table-link float-right"
        >
          <span className="fa-stack">
            <i className="fa fa-square fa-stack-2x"></i>
            <i className="fa fa-plus fa-stack-1x fa-inverse"></i>
          </span>
        </Link>
      );
    }
    let editableCheck;

    if (issue.issueLeader === user.username && issue.status === "TO DO") {
      editableCheck = (
        <div className="row">
          <div className="col-sm-12">
            <div className="text-right mt-4">
              <Link
                to={`/updateIssue/${issue.issueId}`}
                type="button"
                className="btn btn-primary waves-effect waves-light"
              >
                <i className="fas fa-pencil-alt"></i> Edit
              </Link>{" "}
              <button
                type="button"
                className="btn btn-danger waves-effect"
                onClick={this.onDeleteClick.bind(this, issue.issueId)}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      );
    }
    let statusCheck;
    if (issue.status === "TO DO")
      statusCheck = <span className="badge badge-danger">{issue.status}</span>;
    else if (issue.status === "IN PROGRESS")
      statusCheck = <span className="badge badge-warning">{issue.status}</span>;
    else if (issue.status === "DONE")
      statusCheck = <span className="badge badge-success">{issue.status}</span>;

    return (
      <div id="tlo2" className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="card-box task-detail">
                <div className="media mt-0 m-b-30">
                  <img
                    className="d-flex mr-3 rounded-circle"
                    alt="64x64"
                    src={logo}
                    style={{ width: "48px", height: "48px" }}
                  />
                  <div className="media-body">
                    <h5 className="media-heading mb-0 mt-0">
                      {issue.carModel}
                      <p
                        className="float-right"
                        style={{ color: "lightgray", marginBottom: "-1.5rem" }}
                      >
                        Created at: {issue.creationDate}
                      </p>
                    </h5>
                    <span>
                      {statusCheck}
                      <p className="float-right" style={{ color: "gray" }}>
                        Localization: {issue.localization}
                      </p>
                    </span>
                    <hr />
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "#fbfbfb",
                    textAlign: "center"
                  }}
                >
                  <h6 style={{ color: "#888" }}>
                    <i className="far fa-clipboard"></i> Issue description
                  </h6>
                  <h4 className="m-b-20">{issue.title}</h4>
                  <p className="text-muted">{issue.description}</p>
                </div>
                <br />
                <div
                  style={{
                    backgroundColor: "#fbfbfb",
                    textAlign: "center",
                    display: "flow-root"
                  }}
                >
                  <h6 style={{ paddingTop: "10px", color: "#888" }}>
                    <i className="fa fa-calendar-alt"></i> Availability
                  </h6>
                  <ul className="list-inline task-dates m-b-0">
                    <li
                      style={{
                        borderRight: "1px",
                        borderRightStyle: "solid",
                        borderColor: "#e6e6e6",
                        marginBottom: "5px"
                      }}
                    >
                      <h5 className="m-b-5" style={{ marginBottom: "0" }}>
                        Start Date
                      </h5>
                      <p>{issue.dateFrom}</p>
                    </li>
                    <li>
                      <h5 className="m-b-5" style={{ marginBottom: "0" }}>
                        End Date
                      </h5>
                      <p>{issue.dateTo}</p>
                    </li>
                  </ul>
                </div>
                <div className="clearfix"></div>

                <hr />
                {/*assigned to*/}
                <div className="task-tags mt-4">
                  <h4>Issue assigned to</h4>
                </div>
                {assignedTo}

                {editableCheck}
              </div>
            </div>
            {/* <!-- end col --> */}
            <div className="col-lg-4">
              <div className="card-box" style={acceptedCheck}>
                {addOfferCheck}
                <h4 className="header-title m-b-30">
                  <i
                    className="fas fa-clipboard-list"
                    style={{ color: "gray" }}
                  ></i>{" "}
                  Offers ({offers.length})
                </h4>
                <hr />
                <div>{offerss}</div>
              </div>
            </div>
            {/* <!-- end col --> */}
          </div>
          {/* <!-- end row --> */}
        </div>
        {/* <!-- container --> */}
      </div>
    );
  }
}

IssueBoard.propTypes = {
  getIssue: PropTypes.func.isRequired,
  deleteIssue: PropTypes.func.isRequired,
  getOffersByIssue: PropTypes.func.isRequired,
  issue: PropTypes.object.isRequired,
  security: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  markAsDone: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  issue: state.issue,
  security: state.security,
  offer: state.offer,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getIssue, deleteIssue, getOffersByIssue, markAsDone }
)(IssueBoard);
