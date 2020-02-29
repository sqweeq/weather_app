import React, { useEffect } from "react";
import "./App.css";
import WeatherSearch from "./components/WeatherSearch";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import CloudIcon from "@material-ui/icons/Cloud";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Nearby from "../src/components/Nearby";
import Register from "./components/auth/Register";
import { Provider } from "react-redux";
import Dashboard from "../src/components/Dashboard";
import store from "./store";
import { loadUser } from "./actions/authActions";
import Login from "../src/components/auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            showLabels
            className="navbar"
          >
            <BottomNavigationAction
              component={Link}
              to="/"
              value=""
              label="Saved Cities"
              icon={<FavoriteIcon />}
            />
            <BottomNavigationAction
              component={Link}
              value="search"
              to="/search"
              label="Weather Search"
              icon={<CloudIcon />}
            />

            <BottomNavigationAction
              component={Link}
              to="/nearby"
              value="nearby"
              label="Nearby"
              icon={<LocationOnIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="/login"
              value="login"
              label="Login"
              icon={<AccessibilityIcon />}
            />

            <BottomNavigationAction
              component={Link}
              to="/register"
              value="register"
              label="Register"
              icon={<VpnKeyIcon />}
            />
          </BottomNavigation>
          {/* <Switch> */}
          <Route path="/search" component={WeatherSearch} />
          <Route path="/nearby" component={Nearby} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/" exact component={Dashboard} />
          {/* </Switch> */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;
