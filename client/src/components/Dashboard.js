import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getItems, handleShow, deleteItem } from "../actions/itemActions";
import { logout } from "../actions/authActions";
import { Carousel } from "react-bootstrap";
import { Button } from "@material-ui/core";

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  componentDidMount() {
    this.props.getItems();
  }
  onLogout = () => {
    this.props.logout();
  };
  onDeleteClick = id => {
    this.props.deleteItem(id);
    // console.log(id);
  };
  onHandleShow = id => {
    this.props.handleShow(id);
    // console.log(id);
  };

  render() {
    function getMyDay(day) {
      const date1 = new Date(day);
      const dayOfWeekIndex = date1.getDay();
      const dayNames = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sund"];
      return dayNames[dayOfWeekIndex];
    }
    function getMyMonth(month) {
      const month1 = new Date(month);
      const dayOfMonthIndex = month1.getMonth();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ];
      return monthNames[dayOfMonthIndex];
    }
    const { items } = this.props.item;
    const { user } = this.props.auth;
    const { isAuthenticated } = this.props.auth;
    // items.map((each, i) => console.log(items[i].showMore));
    const userItems = items && items.filter(item => item.newID === user._id);
    console.log(userItems);

    return (
      <div className="container">
        {isAuthenticated === true ? (
          <div className="dashboard-weather-container">
            <Button
              variant="outlined"
              color="primary"
              className="logout-button"
              onClick={this.onLogout}
            >
              Log me out
            </Button>
            <h1>Hi {user.name}</h1>
            <p>This is your dashboard</p>
            <p>
              {userItems && userItems.length === 0
                ? "Search and add cities to your dashboard!"
                : null}
            </p>
            <div className="all-weather-container">
              {items.map(({ weathers, _id, newID }, i) =>
                newID === user._id
                  ? weathers && (
                      <div className="each-weather" key={_id}>
                        <div className="each-container">
                          <Button
                            className="weather-button weather-delete"
                            variant="outlined"
                            color="secondary"
                            onClick={() => this.onDeleteClick(_id)}
                          >
                            Delete from list
                          </Button>
                          <br />
                          <h3 className="each-weather-title">
                            {weathers[0].res.title && weathers[0].res.title}
                          </h3>
                          <h6>Timezone: {weathers[0].res.timezone}</h6>
                          <h6>Time: {weathers[0].res.time.slice(11, 16)}</h6>
                          <h6>
                            Temperature:{" "}
                            {weathers[0].res.consolidated_weather[0].the_temp &&
                              weathers[0].res.consolidated_weather[0].the_temp.toFixed(
                                1
                              )}{" "}
                            degrees celcius
                          </h6>

                          <Carousel interval={0}>
                            <Carousel.Item>
                              <h6>Today</h6>
                              <img
                                className="weather-image"
                                src={`https://www.metaweather.com/static/img/weather/${weathers[0].res.consolidated_weather[0].weather_state_abbr}.svg`}
                                alt="weather state"
                              />
                              <h6>
                                {
                                  weathers[0].res.consolidated_weather[0]
                                    .weather_state_name
                                }
                              </h6>
                              <h6>
                                {weathers[0].res.consolidated_weather[0]
                                  .the_temp &&
                                  weathers[0].res.consolidated_weather[0].the_temp.toFixed(
                                    1
                                  )}
                              </h6>
                              <h6>
                                Predictability:{" "}
                                {weathers[0].res.consolidated_weather[0]
                                  .predictability &&
                                  weathers[0].res.consolidated_weather[0]
                                    .predictability}
                                %
                              </h6>
                            </Carousel.Item>

                            {weathers[0].res.consolidated_weather &&
                              weathers[0].res.consolidated_weather.map(
                                (weather, i) => (
                                  <Carousel.Item
                                    className="show-more-each"
                                    key={i}
                                  >
                                    {i === 0 ? (
                                      <h6>Tomorrow</h6>
                                    ) : (
                                      <h6>
                                        {getMyDay(weather.applicable_date)}{" "}
                                        {parseInt(
                                          weather.applicable_date.slice(8, 10)
                                        ) < 10
                                          ? weather.applicable_date.slice(9, 10)
                                          : weather.applicable_date.slice(
                                              8,
                                              10
                                            )}{" "}
                                        {getMyMonth(weather.applicable_date)}
                                      </h6>
                                    )}
                                    <img
                                      className="weather-image"
                                      src={`https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`}
                                      alt="weather state"
                                    />
                                    <h6>{weather.weather_state_name}</h6>
                                    <h6>
                                      {weather.the_temp &&
                                        weather.the_temp.toFixed(1)}
                                      C
                                    </h6>
                                    <h6>
                                      Predictability:{" "}
                                      {weather.predictability &&
                                        weather.predictability}
                                      %
                                    </h6>
                                  </Carousel.Item>
                                )
                              )}
                          </Carousel>
                        </div>
                      </div>
                    )
                  : null
              )}
            </div>
          </div>
        ) : (
          <div>
            <h1>Hi guest!</h1>
            <p>This is your dashboard, please login to view</p>
          </div>
        )}
      </div>
    );
  }
}
Dashboard.propTypes = {
  getItems: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  handleShow: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
  // item: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  item: state.item,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getItems,
  deleteItem,
  handleShow,
  logout
})(Dashboard);
