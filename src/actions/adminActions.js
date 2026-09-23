import axios from "axios";
import {
  GET_USERS,
  DELETE_USER,
  FIND_USER,
  GET_ERRORS,
  GET_WORKSHOPS,
  DELETE_WORKSHOP,
  ACCEPT_WORKSHOP,
  GET_OPINIONS,
  GET_PAGEDOPINIONS
} from "./types";

export const getUsers = () => async dispatch => {
  const res = await axios.get(`/admin/getUsers`);
  dispatch({
    type: GET_USERS,
    payload: res.data
  });
};

export const getPagedUsers = (pageSize, pageNo) => async dispatch => {
  const res = await axios.get(
    `/admin/getPagedUsers?pageSize=${pageSize}&pageNo=${pageNo}`
  );
  dispatch({
    type: GET_USERS,
    payload: res.data
  });
};

export const deleteUser = id => async dispatch => {
  if (window.confirm(`Are you sure? This will delete user with ID: ${id}.`)) {
    await axios.delete(`/admin/deleteUserById/${id}`);
    dispatch({
      type: DELETE_USER,
      payload: id
    });
  }
};

export const addAdmin = (id, history) => async dispatch => {
  if (window.confirm(`Are you sure? This will add admin role`)) {
    try {
      await axios.patch(`/admin/addAdmin/${id}`);
      history.push("/admin/userList");
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
  }
};

export const findUser = (id, history) => async dispatch => {
  try {
    const res = await axios.get(
      `/admin/findUserById/${id}`
    );
    dispatch({
      type: FIND_USER,
      payload: res.data
    });
  } catch (error) {
    history.push("/dashboard");
  }
};

export const adminEditUser = (user, history) => async dispatch => {
  try {
    await axios.patch("/admin/AdminEditUser", user);
    history.push("/admin/userList");
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

export const getWorkshops = () => async dispatch => {
  const res = await axios.get("/admin/getWorkshops");
  dispatch({
    type: GET_WORKSHOPS,
    payload: res.data
  });
};

export const getPagedAcceptedWorkshops = (
  pageSize,
  pageNo
) => async dispatch => {
  const res = await axios.get(
    `/admin/getPagedAcceptedWorkshops?pageSize=${pageSize}&pageNo=${pageNo}`
  );
  dispatch({
    type: GET_WORKSHOPS,
    payload: res.data
  });
};

export const getPagedPendingWorkshops = (
  pageSize,
  pageNo
) => async dispatch => {
  const res = await axios.get(
    `/admin/getPagedPendingWorkshops?pageSize=${pageSize}&pageNo=${pageNo}`
  );
  dispatch({
    type: GET_WORKSHOPS,
    payload: res.data
  });
};

export const acceptWorkshop = id => async dispatch => {
  if (window.confirm(`Do you want to accept workshop with ID: ${id}?`)) {
    await axios.patch(`/admin/acceptWorkshop/${id}`);
    dispatch({
      type: ACCEPT_WORKSHOP,
      payload: id
    });
  }
};

export const deleteWorkshop = id => async dispatch => {
  if (
    window.confirm(`Are you sure? This will delete workshop with ID: ${id}.`)
  ) {
    await axios.delete(`/admin/deleteWorkshopById/${id}`);
    dispatch({
      type: DELETE_WORKSHOP,
      payload: id
    });
  }
};

export const banOpinion = opinionId => async dispatch => {
  if (window.confirm("Are you sure? This will ban that review.")) {
    try {
      await axios.patch(`/admin/banOpinion/${opinionId}`);
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

export const unbanOpinion = opinionId => async dispatch => {
  if (window.confirm("Are you sure? This will unban that review.")) {
    try {
      await axios.patch(
        `/admin/unbanOpinion/${opinionId}`
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
        `/admin/unreportOpinion/${opinionId}`
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

export const getReportedOpinions = () => async dispatch => {
  const res = await axios.get(
    "/admin/getReportedOpinions"
  );
  dispatch({
    type: GET_OPINIONS,
    payload: res.data
  });
};

export const getPagedReportedOpinions = (
  pageSize,
  pageNo
) => async dispatch => {
  const res = await axios.get(
    `/admin/getPagedReportedOpinions?pageSize=${pageSize}&pageNo=${pageNo}`
  );
  dispatch({
    type: GET_PAGEDOPINIONS,
    payload: res.data
  });
};

export const getPagedBannedOpinions = (pageSize, pageNo) => async dispatch => {
  const res = await axios.get(
    `/admin/getPagedBannedOpinions?pageSize=${pageSize}&pageNo=${pageNo}`
  );
  dispatch({
    type: GET_PAGEDOPINIONS,
    payload: res.data
  });
};

export const getOpinionsByUserId = id => async dispatch => {
  const res = await axios.get(
    `/admin/getOpinionsByUserId/${id}`
  );
  dispatch({
    type: GET_OPINIONS,
    payload: res.data
  });
};
