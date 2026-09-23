import axios from "axios";
import {
  GET_ERRORS,
  GET_WORKSHOP,
  GET_OWNERWORKSHOPS,
  GET_ISSUES,
  GET_ISSUESOFFERED
} from "./types";
import { getUsers } from "./adminActions";

export const createWorkshop = (workshop, history) => async dispatch => {
  try {
    await axios.post("/workshop/add", workshop);
    history.push("/workshop/workshopList");
    getUsers();
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

export const getWorkshop = (id, history) => async dispatch => {
  try {
    const res = await axios.get(
      `/workshop/findById/${id}`
    );
    dispatch({
      type: GET_WORKSHOP,
      payload: res.data
    });
  } catch (error) {
    history.push("/dashboard");
  }
};

export const getOwnerWorkshops = () => async dispatch => {
  const res = await axios.get("/workshop/getAll");
  dispatch({
    type: GET_OWNERWORKSHOPS,
    payload: res.data
  });
};

export const getAllIssues = () => async dispatch => {
  const res = await axios.get("/owner/getIssues");
  dispatch({
    type: GET_ISSUES,
    payload: res.data
  });
};

export const getAllIssuesOffered = () => async dispatch => {
  const res = await axios.get("/owner/getIssuesOffered");
  dispatch({
    type: GET_ISSUESOFFERED,
    payload: res.data
  });
};
