import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { declineOffer, acceptOffer } from "../../../actions/offerActions";
import { t } from "../../../i18n/translations";

class OfferItem extends Component {
  onDeclineClick = id => {
    this.props.declineOffer(id);
  };

  onAcceptClick = id => {
    this.props.acceptOffer(id);
  };

  render() {
    const { offer } = this.props;
    const { user } = this.props.security;
    const { issue } = this.props.issue;

    const offerId = offer.offerId || offer.id;

    let checkAcceptable;
    if (issue && (issue.issueLeader === user?.username || !issue.acceptedOffer)) {
      checkAcceptable = (
        <div className="mt-2 pt-2 border-top d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-success font-weight-bold mr-2"
            onClick={() => this.onAcceptClick(offerId)}
          >
            <i className="fas fa-check mr-1"></i> {t("acceptOffer")}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger font-weight-bold"
            onClick={() => this.onDeclineClick(offerId)}
          >
            <i className="fas fa-times mr-1"></i> {t("declineOffer")}
          </button>
        </div>
      );
    }
    const workshopId = offer.workshop?.id || offer.offeredByWorkshopId || 1;
    const workshopName = offer.workshop?.name || "ورشة الصيانة";

    return (
      <div className="card mb-3 p-3 bg-white shadow-sm border-0" style={{ borderRadius: "8px" }}>
        <div className="media">
          <div className="d-flex mr-3">
            <img
              className="media-object rounded-circle thumb-sm"
              alt="64x64"
              style={{ width: "45px", height: "45px" }}
              src="https://cdn2.iconfinder.com/data/icons/mechanic-light/64/tools_repair_mechanican_car_repair_garage_car_workshop-512.png"
            />
          </div>
          <div className="media-body">
            <Link to={`/workshopProfile/${workshopId}`} className="text-dark">
              <h5 className="mt-0 font-weight-bold text-primary">{workshopName}</h5>
            </Link>
            <div className="font-13 text-muted mb-0">
              <div className="mb-1">
                <strong>{t("price")}:</strong> <span className="text-success font-weight-bold">${offer.price}</span>
              </div>
              <div className="mb-1">
                <strong>الموعد المقترح:</strong> {offer.preferedDate}
              </div>
              <div>
                <strong>المدة المتوقعة:</strong> {offer.estTime}
              </div>
            </div>
            {checkAcceptable}
          </div>
        </div>
      </div>
    );
  }
}

OfferItem.propTypes = {
  declineOffer: PropTypes.func.isRequired,
  acceptOffer: PropTypes.func.isRequired,
  security: PropTypes.object.isRequired,
  issue: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security,
  issue: state.issue
});

export default connect(
  mapStateToProps,
  { declineOffer, acceptOffer }
)(OfferItem);
