import axios from "axios";
import { GET_OFFERS, GET_ERRORS, DECLINE_OFFER } from "./types";

export const getOffersByIssue = (id, history) => async dispatch => {
  try {
    const res = await axios.get(`/offer/${id}`);
    dispatch({
      type: GET_OFFERS,
      payload: res.data
    });
  } catch (error) {
    history.push("/dashboard");
  }
};

export const addOffer = (issueId, offer, history) => async dispatch => {
  try {
    await axios.post(`/offer/${issueId}`, offer);
    history.push(`/issueBoard/${issueId}`);
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const declineOffer = id => async dispatch => {
  if (window.confirm("Are you sure? This will decline that offer.")) {
    await axios.delete(`/offer/${id}`);
    dispatch({
      type: DECLINE_OFFER,
      payload: id
    });
  }
};

export const acceptOffer = id => async dispatch => {
  if (window.confirm("Are you sure? This will accept that offer.")) {
    try {
      await axios.post(`/offer/accept/${id}`);
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      window.location.reload();
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
};
