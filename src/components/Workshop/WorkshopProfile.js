import React, { Component } from "react";
import { getWorkshop } from "../../actions/workshopActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./WorkshopProfile.css";
import { getIssuesToOpinion } from "../../actions/issueActions";
import { acceptWorkshop, deleteWorkshop } from "../../actions/adminActions";
import { getOpinionsById, addOpinion } from "../../actions/opinionActions";
import { Link } from "react-router-dom";
import userr from "../../icons/user.png";
import "./Opinion.css";
import classnames from "classnames";
import OpinionItem from "./OpinionItem";

class WorkshopProfile extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      activeTab: "info",
      rate: 5,
      description: "",
      id: id,
      opinionedByIssueId: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const newOpinion = {
      rate: this.state.rate,
      description: this.state.description,
      opinionedByIssueId: this.state.opinionedByIssueId
    };
    this.props.addOpinion(this.state.id, newOpinion, this.props.history);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getWorkshop(id, this.props.history);
    this.props.getOpinionsById(id, this.props.history);
    this.props.getIssuesToOpinion(id);
  }

  onDeleteClick = id => {
    this.props.deleteWorkshop(id);
  };

  onAcceptWorkshopClick = id => {
    this.props.acceptWorkshop(id, this.props.history);
  };

  handleClick(starValue) {
    this.setState({ rate: starValue });
  }
  render() {
    const { workshop } = this.props.workshop;
    const { user } = this.props.security;
    const { issues } = this.props.issue;
    const { opinions } = this.props.opinion;
    const { errors } = this.state;

    var rateSum = 0;
    var opinionsLength = 0;
    var avgRate = 0;
    var [rate1, rate2, rate3, rate4, rate5] = [0, 0, 0, 0, 0];
    var opinionsNotBanned = opinions.filter(item => item.banned === false);
    if (opinionsNotBanned.length > 0) {
      opinionsLength = opinionsNotBanned.length;
      for (var i = 0; i < opinionsNotBanned.length; i++) {
        rateSum += opinionsNotBanned[i].rate;
      }
      rate1 =
        (opinionsNotBanned.filter(item => item.rate === 1).length /
          opinionsLength) *
        100;
      rate2 =
        (opinionsNotBanned.filter(item => item.rate === 2).length /
          opinionsLength) *
        100;
      rate3 =
        (opinionsNotBanned.filter(item => item.rate === 3).length /
          opinionsLength) *
        100;
      rate4 =
        (opinionsNotBanned.filter(item => item.rate === 4).length /
          opinionsLength) *
        100;
      rate5 =
        (opinionsNotBanned.filter(item => item.rate === 5).length /
          opinionsLength) *
        100;
      avgRate = rateSum / opinionsLength;
    }

    //Rate form visible only when issue is fixed by that workshop
    let ratingForm;
    if (issues.length > 0) {
      ratingForm = (
        <div className="bg-white rounded shadow-sm p-4 mb-5 rating-review-select-page">
          <h5 className="mb-4">Rate this workshop</h5>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <span style={{ color: "black" }}>Select a rating: </span>
              <br />
              <div
                className="stars"
                style={{
                  color: "orange",
                  fontSize: "25px",
                  paddingBottom: "20px"
                }}
              >
                <i
                  class={this.state.rate >= 1 ? "fas fa-star" : "far fa-star"}
                  onClick={this.handleClick.bind(this, 1)}
                ></i>
                <i
                  class={this.state.rate >= 2 ? "fas fa-star" : "far fa-star"}
                  onClick={this.handleClick.bind(this, 2)}
                ></i>
                <i
                  class={this.state.rate >= 3 ? "fas fa-star" : "far fa-star"}
                  onClick={this.handleClick.bind(this, 3)}
                ></i>
                <i
                  class={this.state.rate >= 4 ? "fas fa-star" : "far fa-star"}
                  onClick={this.handleClick.bind(this, 4)}
                ></i>
                <i
                  class={this.state.rate >= 5 ? "fas fa-star" : "far fa-star"}
                  onClick={this.handleClick.bind(this, 5)}
                ></i>
              </div>
              <textarea
                className={classnames("form-control form-control-lg", {
                  "is-invalid": errors.description
                })}
                name="description"
                placeholder="Description"
                value={this.state.description}
                onChange={this.onChange}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>
            <div className="form-group">
              <select
                className="form-control form-control-lg"
                name="opinionedByIssueId"
                onChange={this.onChange}
                value={this.state.opinionedByIssueId}
              >
                <option value="">Select issue</option>
                {issues.map(issue => (
                  <option key={issue.issueId} value={issue.issueId}>
                    {issue.title} ({issue.carModel})
                  </option>
                ))}
                ;
              </select>
            </div>
            <input type="submit" className="btn btn-primary btn-block mt-4" />
          </form>
        </div>
      );
    }

    let accepted;
    if (workshop.accepted === true) {
      accepted = <span className="badge badge-success">true</span>;
    } else accepted = <span className="badge badge-danger">false</span>;

    let verification;
    //Jezeli rola ADMIN i accepted==false => wyswietl buttony ACCEPT or DELETE
    if (
      user.roles.some(e => e.authority === "ROLE_ADMIN") &&
      workshop.accepted === false
    ) {
      verification = (
        <div>
          <div>
            <p style={{ marginBottom: 0 }}>Application:</p>
            <Link
              to={`/admin/pendingWorkshopList`}
              onClick={this.onAcceptWorkshopClick.bind(this, workshop.id)}
              className="btn btn-success"
            >
              <i className="fa fa-check fa-inverse">
                <span style={{ fontSize: "14px", fontFamily: "Verdana" }}>
                  {" "}
                  Accept
                </span>
              </i>
            </Link>{" "}
            <Link to={`/admin/pendingWorkshopList`} className="btn btn-danger">
              <i
                className="fa fa-trash fa-inverse"
                onClick={this.onDeleteClick.bind(this, workshop.id)}
              >
                <span style={{ fontSize: "14px", fontFamily: "Verdana" }}>
                  {" "}
                  Delete
                </span>
              </i>
            </Link>
          </div>
        </div>
      );
    }
    if (
      user.roles.some(e => e.authority === "ROLE_ADMIN") &&
      workshop.accepted === true
    ) {
      verification = (
        <Link
          to={`/admin/pendingWorkshopList`}
          className="btn btn-danger"
          style={{ fontFamily: "sans-serif" }}
        >
          <i
            className="fa fa-trash fa-inverse"
            onClick={this.onDeleteClick.bind(this, workshop.id)}
          >
            <span style={{ fontSize: "14px", fontFamily: "Verdana" }}>
              {" "}
              Delete
            </span>
          </i>
        </Link>
      );
    }

    let emptyOpinionsAlert;
    if (opinions.length === 0) {
      emptyOpinionsAlert = (
        <div className="alert alert-warning text-center" role="alert">
          There are no opinions yet
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-3" style={{ maxHeight: "430px" }}>
            <div className="osahan-account-page-left shadow-sm bg-white h-100">
              <div className="border-bottom p-4">
                <div className="osahan-user text-center">
                  <div className="osahan-user-media">
                    <img
                      className="mb-3 rounded-pill shadow-sm mt-1"
                      src={userr}
                      alt="user"
                    />
                    <div className="osahan-user-media-body">
                      <h6 className="mb-2">
                        <b>Owner</b>: {workshop.owner}
                      </h6>
                      <p className="mb-1">Verified: {accepted}</p>
                      <p className="mb-0 text-black font-weight-bold">
                        {verification}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul
                className="nav nav-tabs flex-column border-0 pt-4 pl-4 pb-4"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link text-left w-100 btn btn-link ${this.state.activeTab === "info" ? "active font-weight-bold" : "text-muted"}`}
                    onClick={() => this.setState({ activeTab: "info" })}
                    style={{ outline: "0", border: "none", textDecoration: "none" }}
                  >
                    <i className="fas fa-info-circle mr-2"></i> Information
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link text-left w-100 btn btn-link ${this.state.activeTab === "opinions" ? "active font-weight-bold" : "text-muted"}`}
                    onClick={() => this.setState({ activeTab: "opinions" })}
                    style={{ outline: "0", border: "none", textDecoration: "none" }}
                  >
                    <i className="fas fa-star mr-2 text-warning"></i> Opinions ({opinions.length})
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-9">
            <div className="osahan-account-page-right shadow-sm bg-white p-4 h-100">
              {/* Information content */}
              <div className="tab-content" id="myTabContent">
                {this.state.activeTab === "info" && (
                <div
                  className="tab-pane fade active show"
                  id="description"
                  role="tabpanel"
                >
                  <div className="bg-white card mb-4 order-list shadow-sm">
                    <div className="slider">
                      <div
                        id="carouselExampleIndicators"
                        className="carousel slide"
                        data-ride="carousel"
                      >
                        <ol className="carousel-indicators">
                          <li
                            data-target="#carouselExampleIndicators"
                            data-slide-to="0"
                            className="active"
                          ></li>
                          <li
                            data-target="#carouselExampleIndicators"
                            data-slide-to="1"
                          ></li>
                          <li
                            data-target="#carouselExampleIndicators"
                            data-slide-to="2"
                          ></li>
                        </ol>
                        <div className="carousel-inner">
                          <div className="carousel-item active">
                            <img
                              className="d-block w-100"
                              style={{ height: "290px" }}
                              src="https://images.squarespace-cdn.com/content/v1/585c624ebe6594527e0c44e0/1543354184974-0US7H3GLPULRT97RK098/ke17ZwdGBToddI8pDm48kPTrHXgsMrSIMwe6YW3w1AZ7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0k5fwC0WRNFJBIXiBeNI5fKTrY37saURwPBw8fO2esROAxn-RKSrlQamlL27g22X2A/20181102_180557.jpg"
                              alt="First slide"
                            />
                          </div>
                          <div className="carousel-item">
                            <img
                              className="d-block w-100"
                              style={{ height: "290px" }}
                              src="http://www.infonius.com.pl/wp-content/uploads/2018/03/jak-wybrac-dobry-warsztat-samochodowy-e1520490350728.jpg"
                              alt="Second slide"
                            />
                          </div>
                          <div className="carousel-item">
                            <img
                              className="d-block w-100"
                              style={{ height: "290px" }}
                              src="https://warsztat.pl/img/artykuly/54708_budujemy-warsztat-samochodowy-cz-2-wymogi-_1.jpg"
                              alt="Third slide"
                            />
                          </div>
                        </div>
                        <a
                          className="carousel-control-prev"
                          href="#carouselExampleIndicators"
                          role="button"
                          data-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="sr-only">Previous</span>
                        </a>
                        <a
                          className="carousel-control-next"
                          href="#carouselExampleIndicators"
                          role="button"
                          data-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="sr-only">Next</span>
                        </a>
                      </div>
                    </div>
                    <div className="gold-members p-4">
                      <div className="media">
                        <img
                          className="mr-4"
                          src="https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/information.png"
                          alt="Generic placeholder"
                        />
                        <div className="media-body">
                          <span className="float-right text-info">
                            Created at {workshop.creationDate}{" "}
                            <i className="icofont-check-circled text-success"></i>
                          </span>
                          <h6 className="mb-2">
                            <a
                              href={`/workshopProfile/${workshop.id}`}
                              className="text-black"
                              style={{ fontSize: "25px" }}
                            >
                              {workshop.name}
                            </a>
                          </h6>
                          <p className="text-gray mb-1">
                            <i className="fas fa-location-arrow"></i>{" "}
                            {workshop.address}
                          </p>
                          <p className="text-gray mb-1">
                            <i
                              className="fas fa-mobile-alt"
                              style={{ marginRight: "5px" }}
                            ></i>
                            {"     "}
                            {workshop.telephone}
                          </p>
                          <p className="text-dark">
                            <b>Description</b>: {workshop.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
                {/*Opinions content */}
                {this.state.activeTab === "opinions" && (
                <div
                  className="tab-pane fade active show"
                  id="opinions"
                  role="tabpanel"
                >
                  <div
                    className="tab-pane fade active show"
                    id="pills-reviews"
                    role="tabpanel"
                    aria-labelledby="pills-reviews-tab"
                  >
                    {/* Rating form */}
                    {ratingForm}
                    <div className="bg-white rounded shadow-sm p-4 mb-4 clearfix graph-star-rating">
                      <h5 className="mb-0 mb-4 float-left">
                        Ratings and Reviews
                      </h5>
                      <p
                        className="text-black  float-right"
                        style={{ textAlign: "center" }}
                      >
                        Average: {avgRate}
                        <br />
                        <div style={{ color: "orange", fontSize: "20px" }}>
                          <i
                            className={
                              avgRate >= 1 ? "fas fa-star" : "far fa-star"
                            }
                          ></i>
                          <i
                            className={
                              avgRate >= 2 ? "fas fa-star" : "far fa-star"
                            }
                          ></i>
                          <i
                            className={
                              avgRate >= 3 ? "fas fa-star" : "far fa-star"
                            }
                          ></i>
                          <i
                            className={
                              avgRate >= 4 ? "fas fa-star" : "far fa-star"
                            }
                          ></i>
                          <i
                            className={
                              avgRate >= 4.5 ? "fas fa-star" : "far fa-star"
                            }
                          ></i>
                        </div>
                      </p>
                      <div className="graph-star-rating-body">
                        <div className="rating-list">
                          <div className="rating-list-left">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="rating-list-center">
                            <div className="progress">
                              <div
                                style={{ width: rate5 + "%" }}
                                aria-valuemax="5"
                                aria-valuemin="0"
                                aria-valuenow="5"
                                role="progressbar"
                                className="progress-bar bg-warning"
                              >
                                <span className="sr-only">
                                  80% Complete (danger)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="rating-list-right">{rate5}%</div>
                        </div>
                        <div className="rating-list">
                          <div className="rating-list-left">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="rating-list-center">
                            <div className="progress">
                              <div
                                style={{ width: rate4 + "%" }}
                                aria-valuemax="5"
                                aria-valuemin="0"
                                aria-valuenow="5"
                                role="progressbar"
                                className="progress-bar bg-warning"
                              >
                                <span className="sr-only">
                                  80% Complete (danger)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="rating-list-right">{rate4}%</div>
                        </div>
                        <div className="rating-list">
                          <div className="rating-list-left">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="rating-list-center">
                            <div className="progress">
                              <div
                                style={{ width: rate3 + "%" }}
                                aria-valuemax="5"
                                aria-valuemin="0"
                                aria-valuenow="5"
                                role="progressbar"
                                className="progress-bar bg-warning"
                              >
                                <span className="sr-only">
                                  80% Complete (danger)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="rating-list-right">{rate3}%</div>
                        </div>
                        <div className="rating-list">
                          <div className="rating-list-left">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="rating-list-center">
                            <div className="progress">
                              <div
                                style={{ width: rate2 + "%" }}
                                aria-valuemax="5"
                                aria-valuemin="0"
                                aria-valuenow="5"
                                role="progressbar"
                                className="progress-bar bg-warning"
                              >
                                <span className="sr-only">
                                  80% Complete (danger)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="rating-list-right">{rate2}%</div>
                        </div>
                        <div className="rating-list">
                          <div className="rating-list-left">
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="rating-list-center">
                            <div className="progress">
                              <div
                                style={{ width: rate1 + "%" }}
                                aria-valuemax="5"
                                aria-valuemin="0"
                                aria-valuenow="5"
                                role="progressbar"
                                className="progress-bar bg-warning"
                              >
                                <span className="sr-only">
                                  80% Complete (danger)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="rating-list-right">{rate1}%</div>
                        </div>
                      </div>
                    </div>
                    {/* Opinions items */}
                    <div className="bg-white rounded shadow-sm p-4 mb-4 restaurant-detailed-ratings-and-reviews">
                      <h5 className="mb-2">All Ratings and Reviews</h5>
                      {opinions.map(opinion => (
                        <OpinionItem
                          key={opinion.opinionId}
                          opinion={opinion}
                        />
                      ))}
                      {emptyOpinionsAlert}
                    </div>
                  </div>
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

WorkshopProfile.propTypes = {
  getWorkshop: PropTypes.func.isRequired,
  workshop: PropTypes.object.isRequired,
  security: PropTypes.object.isRequired,
  acceptWorkshop: PropTypes.func.isRequired,
  deleteWorkshop: PropTypes.func.isRequired,
  getOpinionsById: PropTypes.func.isRequired,
  addOpinion: PropTypes.func.isRequired,
  getIssuesToOpinion: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  workshop: state.workshop,
  security: state.security,
  opinion: state.opinion,
  issue: state.issue,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    getWorkshop,
    acceptWorkshop,
    deleteWorkshop,
    getOpinionsById,
    addOpinion,
    getIssuesToOpinion
  }
)(WorkshopProfile);
