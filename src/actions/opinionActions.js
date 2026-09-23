import axios from "axios";
import { GET_OPINIONS, GET_ERRORS } from "./types";

export const getOpinionsById = (id, history) => async dispatch => {
  try {
    const res = await axios.get(`/opinion/getAll/${id}`);
    dispatch({
      type: GET_OPINIONS,
      payload: res.data
    });
  } catch (error) {
    history.push("/dashboard");
  }
};

export const addOpinion = (id, opinion, history) => async dispatch => {
  try {
    await axios.post(`/opinion/add/${id}`, opinion);
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
};

export const reportOpinion = opinionId => async dispatch => {
  if (window.confirm("Are you sure? This will report that review.")) {
    try {
      await axios.patch(
        `/owner/reportOpinion/${opinionId}`
      );
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

export const unreportOpinion = opinionId => async dispatch => {
  if (window.confirm("Are you sure? This will unreport that review.")) {
    try {
      await axios.patch(
        `/owner/unreportOpinion/${opinionId}`
      );
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
