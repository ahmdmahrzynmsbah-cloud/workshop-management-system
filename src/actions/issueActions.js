import axios from "axios";
import { GET_ERRORS, GET_ISSUES, GET_ISSUE, DELETE_ISSUE } from "./types";

export const createIssue = (issue, history) => async dispatch => {
  try {
    await axios.post("/issue/add", issue);
    history.push("/dashboard");
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

export const getIssues = () => async dispatch => {
  const res = await axios.get("/issue/getAll");
  dispatch({
    type: GET_ISSUES,
    payload: res.data
  });
};

export const getIssuesToOpinion = id => async dispatch => {
  const res = await axios.get(
    `/issue/getAllToOpinion/${id}`
  );
  dispatch({
    type: GET_ISSUES,
    payload: res.data
  });
};

export const getIssue = (id, history) => async dispatch => {
  try {
    const res = await axios.get(`/issue/findById/${id}`);
    dispatch({
      type: GET_ISSUE,
      payload: res.data
    });
  } catch (error) {
    history.push("/dashboard");
  }
};

export const deleteIssue = id => async dispatch => {
  if (window.confirm("Are you sure? This will delete your issue.")) {
    await axios.delete(`/issue/deleteById/${id}`);
    dispatch({
      type: DELETE_ISSUE,
      payload: id
    });
  }
};

export const markAsDone = id => async dispatch => {
  if (window.confirm("Are you sure? This will change issue status to DONE.")) {
    try {
      await axios.post(`/issue/done/${id}`);
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
