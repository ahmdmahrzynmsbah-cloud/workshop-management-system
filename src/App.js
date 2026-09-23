import React, { Component } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Header from "./components/Layout/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddIssue from "./components/Issue/AddIssue";
import { Provider } from "react-redux";
import store from "./store";
import UpdateIssue from "./components/Issue/UpdateIssue";
import IssueBoard from "./components/Issue/IssueBoard/IssueBoard";
import AddIssueTask from "./components/IssueBoard/IssueTasks/AddIssueTask";
import UpdateIssueTask from "./components/IssueBoard/IssueTasks/UpdateIssueTask";
import Landing from "./components/Layout/Landing";
import Register from "./components/UserManagement/Register";
import Login from "./components/UserManagement/Login";
import jwt_decode from "jwt-decode";
import setJWTToken from "./securityUtils/setJWTToken";
import { SET_CURRENT_USER } from "./actions/types";
import { logout } from "./actions/securityActions";
import SecuredRoute from "./securityUtils/SecureRoute";
import EditUser from "./components/UserManagement/EditUser";
import UserList from "./components/AdminPanel/Users/UserList";
import AdminRoute from "./securityUtils/AdminRoute";
import adminDashboard from "./components/AdminPanel/adminDashboard";
import AdminEditUser from "./components/AdminPanel/Users/AdminEditUser";
import AddWorkshop from "./components/Workshop/AddWorkshop";
import PendingWorkshopList from "./components/AdminPanel/Workshops/PendingWorkshopList";
import AcceptedWorkshopList from "./components/AdminPanel/Workshops/AcceptedWorkshopList";
import WorkshopProfile from "./components/Workshop/WorkshopProfile";
import UserProfile from "./components/AdminPanel/Users/UserProfile";
import WorkshopRoute from "./securityUtils/WorkshopRoute";
import OwnerDashboard from "./components/Workshop/OwnerDashboard";
import WorkshopList from "./components/Workshop/WorkshopList";
import IssuesDashboard from "./components/Workshop/Issues/IssuesDashboard";
import DiagnosticsIssues from "./components/Workshop/Issues/Lists/DiagnosticsIssues";
import EngineIssues from "./components/Workshop/Issues/Lists/EngineIssues";
import TransmissionIssues from "./components/Workshop/Issues/Lists/TransmissionIssues";
import SuspensionIssues from "./components/Workshop/Issues/Lists/SuspensionIssues";
import ElectronicsIssues from "./components/Workshop/Issues/Lists/ElectronicsIssues";
import OtherIssues from "./components/Workshop/Issues/Lists/OtherIssues";
import AllIssues from "./components/Workshop/Issues/Lists/AllIssues";
import AddOffer from "./components/Issue/IssueBoard/AddOffer";
import OfferedList from "./components/Workshop/Offered/OfferedList";
import ReportedOpinions from "./components/AdminPanel/Opinions/ReportedOpinions";
import BannedOpinions from "./components/AdminPanel/Opinions/BannedOpinions";

const jwtToken = localStorage.jwtToken;
if (jwtToken) {
  try {
    setJWTToken(jwtToken);
    const decoded_jwtToken = jwt_decode(jwtToken);
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: decoded_jwtToken
    });

    const currentTime = Date.now() / 1000;

    if (decoded_jwtToken.exp && decoded_jwtToken.exp < currentTime) {
      store.dispatch(logout());
      window.location.href = "/";
    }
  } catch (err) {
    localStorage.removeItem("jwtToken");
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />
            {
              //Public routes
            }
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />

            {
              //User routes
            }
            <Switch>
              <SecuredRoute exact path="/dashboard" component={Dashboard} />
              <SecuredRoute exact path="/addIssue" component={AddIssue} />
              <SecuredRoute
                exact
                path="/updateIssue/:id"
                component={UpdateIssue}
              />
              <SecuredRoute
                exact
                path="/issueBoard/:id"
                component={IssueBoard}
              />
              <SecuredRoute
                exact
                path="/addIssueTask/:id"
                component={AddIssueTask}
              />
              <SecuredRoute
                exact
                path="/updateIssueTask/:backlog_id/:is_id"
                component={UpdateIssueTask}
              />
              <SecuredRoute exact path="/editUser" component={EditUser} />
              <SecuredRoute
                exact
                path="/workshop/AddWorkshop"
                component={AddWorkshop}
              />
              <SecuredRoute
                exact
                path="/workshopProfile/:id"
                component={WorkshopProfile}
              />

              {
                //Admin routes
              }
              <AdminRoute exact path="/admin/" component={adminDashboard} />
              <AdminRoute exact path="/admin/userList" component={UserList} />
              <AdminRoute
                exact
                path="/admin/editUser/:id"
                component={AdminEditUser}
              />
              <AdminRoute
                exact
                path="/admin/pendingWorkshopList"
                component={PendingWorkshopList}
              />
              <AdminRoute
                exact
                path="/admin/acceptedWorkshopList"
                component={AcceptedWorkshopList}
              />
              <AdminRoute
                exact
                path="/admin/userProfile/:id"
                component={UserProfile}
              />
              <AdminRoute
                exact
                path="/admin/reportedOpinions"
                component={ReportedOpinions}
              />
              <AdminRoute
                exact
                path="/admin/bannedOpinions"
                component={BannedOpinions}
              />

              {
                //Workshopowner routes
              }
              <WorkshopRoute
                exact
                path="/workshop/dashboard"
                component={OwnerDashboard}
              />
              <WorkshopRoute
                exact
                path="/workshop/workshopList"
                component={WorkshopList}
              />
              <WorkshopRoute
                exact
                path="/workshop/issueDashboard"
                component={IssuesDashboard}
              />
              <WorkshopRoute
                exact
                path="/workshop/diagnosticsIssues"
                component={DiagnosticsIssues}
              />
              <WorkshopRoute
                exact
                path="/workshop/engineIssues"
                component={EngineIssues}
              />
              <WorkshopRoute
                exact
                path="/workshop/transmissionIssues"
                component={TransmissionIssues}
              />
              <WorkshopRoute
                exact
                path="/workshop/suspensionIssues"
                component={SuspensionIssues}
              />
              <WorkshopRoute
                exact
                path="/workshop/electronicsIssues"
                component={ElectronicsIssues}
              />
              <WorkshopRoute
                exact
                path="/workshop/otherIssues"
                component={OtherIssues}
              />
              <WorkshopRoute
                exact
                path="/workshop/allIssues"
                component={AllIssues}
              />
              <WorkshopRoute
                exact
                path="/issueBoard/addOffer/:id"
                component={AddOffer}
              />
              <WorkshopRoute
                exact
                path="/addOffer/:id"
                component={AddOffer}
              />
              <WorkshopRoute
                exact
                path="/workshop/offered"
                component={OfferedList}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
