import axios from "axios";
import {
  GET_ERRORS,
  GET_BACKLOG,
  GET_ISSUE_TASK,
  DELETE_ISSUE_TASK
} from "./types";

export const addIssueTask = (
  backlog_id,
  issue_task,
  history
) => async dispatch => {
  try {
    await axios.post(
      `/issue/backlog/${backlog_id}`,
      issue_task
    );
    history.push(`/issueBoard/${backlog_id}`);
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

export const getBacklog = backlog_id => async dispatch => {
  try {
    const res = await axios.get(
      `/issue/backlog/${backlog_id}`
    );
    dispatch({
      type: GET_BACKLOG,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getIssueTask = (backlog_id, is_id, history) => async dispatch => {
  try {
    const res = await axios.get(
      `/issue/backlog/${backlog_id}/${is_id}`
    );
    dispatch({
      type: GET_ISSUE_TASK,
      payload: res.data
    });
  } catch (err) {
    history.push("/dashboard");
  }
};

export const updateIssueTask = (
  backlog_id,
  is_id,
  issue_task,
  history
) => async dispatch => {
  try {
    await axios.patch(
      `/issue/backlog/${backlog_id}/${is_id}`,
      issue_task
    );
    history.push(`/issueBoard/${backlog_id}`);
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

export const deleteIssueTask = (backlog_id, is_id) => async dispatch => {
  if (
    window.confirm(
      `You are deletin issue task ${is_id}, this action cannot be undone`
    )
  ) {
    await axios.delete(
      `/issue/backlog/${backlog_id}/${is_id}`
    );
    dispatch({
      type: DELETE_ISSUE_TASK,
      payload: is_id
    });
  }
};
