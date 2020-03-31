import React, { useState, useEffect } from "react";
import useDebounce from "./useDebounce";
import { Button } from "@material-ui/core";
import { Carousel } from "react-bootstrap";
import { connect } from "react-redux";
import { addItem } from "../actions/itemActions";

const WeatherList = ({ addItem, isAuthenticated, user }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [initialQuery, setInitialQuery] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemToShow, setItemToShow] = useState([]);
  //debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 700);
  const handleChange = e => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (debouncedSearchTerm) {
      getQuery(debouncedSearchTerm);
    } else {
      setInitialQuery([]);
    }
  }, [debouncedSearchTerm]);

  // query many cities worldID, only 11 at a time
  async function getQuery(search) {
    await fetch(
      `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${search}`
    )
      .then(res => res.json())
      .then(res => setInitialQuery(res.slice(0, 10)))
      .catch(err => {
        console.error(err);
      });
  }

  // use each worldID to fetch each city weather data
  useEffect(() => {
    setWeatherData([]);
    const showMoreStuff = false;
    async function getWeather() {
      Promise.all(
        initialQuery.map(item => {
          fetch(
            `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${item.woeid}/`
          )
            .then(res => res.json())
            .then(res =>
              setWeatherData(prevArray => [
                ...prevArray,
                { res, showMoreStuff }
              ])
            )
            .catch(err => {
              console.error(err);
            });
          return null;
        })
      );
    }
    getWeather();
  }, [initialQuery]);

  // funct to return convert day and month from data
  function getMyDay(day) {
    const date1 = new Date(day);
    const dayOfWeekIndex = date1.getDay();
    const dayNames = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
    return dayNames[dayOfWeekIndex];
  }
  function showAdded(i) {
    const preItemToShow = [...itemToShow, i];
    setItemToShow(preItemToShow);
    const newItemShow = itemToShow.filter(item => item !== i);
    setTimeout(() => {
      setItemToShow(newItemShow);
    }, 3500);
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
  // add item to dashboard
  const onAddItemClick = (item, user) => {
    const newItem = {
      name: item.res.title,
      weathers: item,
      newID: user._id
    };
    addItem(newItem);
  };

  // console.log(weatherData);
  // console.log(initialQuery);

  return (
    <div className="container">
      <h1 className="title">Weather Hunter</h1>
      {user && <div>You are logged in!</div>}

      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="input city search"
          className="input-weather"
        />
      </div>

      <h3>Total found: {weatherData.length} </h3>
      {initialQuery.length > 0 && weatherData.length !== initialQuery.length ? (
        <img
          src="https://media.giphy.com/media/l31p1SkNXGz3l1nwwu/giphy.gif"
          alt="loading"
          className="loading-gif"
        />
      ) : (
        <div className="all-weather-container">
          {/* map over queried data */}
          {weatherData.map((item, i) => (
            <div className="each-weather" key={item.res.woeid}>
              <div className="each-container">
                {isAuthenticated === true ? (
                  <Button
                    className="weather-button weather-save"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      showAdded(i);
                      onAddItemClick(item, user);
                    }}
                  >
                    {itemToShow.includes(i) ? "Saved" : "Add"}
                  </Button>
                ) : (
                  <div>Please login to save cities!</div>
                )}
                <br />
                <h3 className="each-weather-title" variant="h3" component="h3">
                  {item.res.title}
                </h3>
                <h6>{item.res.timezone}</h6>
                <h6>Time: {item.res.time.slice(11, 16)}</h6>
                <hr />
                {/* carousel for days of week weather */}
                <Carousel interval={null}>
                  <Carousel.Item>
                    <h6>Today</h6>
                    <img
                      className="weather-image"
                      src={`https://www.metaweather.com/static/img/weather/${item.res.consolidated_weather[0].weather_state_abbr}.svg`}
                      alt="weather state"
                    />
                    <h6>
                      {item.res.consolidated_weather[0].weather_state_name}
                    </h6>
                    <h6>
                      {item.res.consolidated_weather[0].the_temp &&
                        item.res.consolidated_weather[0].the_temp.toFixed(1)}
                      C
                    </h6>
                    <h6>
                      Predictability:{" "}
                      {item.res.consolidated_weather[0].predictability &&
                        item.res.consolidated_weather[0].predictability}
                      %
                    </h6>
                  </Carousel.Item>
                  {/* map */}
                  {item.res.consolidated_weather.map((weather, i) => (
                    <Carousel.Item className="show-more-each" key={i}>
                      {i === 0 ? (
                        <h6>Tomorrow</h6>
                      ) : (
                        <h6>
                          {getMyDay(
                            item.res.consolidated_weather[i].applicable_date
                          )}{" "}
                          {parseInt(
                            item.res.consolidated_weather[
                              i
                            ].applicable_date.slice(8, 10)
                          ) < 10
                            ? item.res.consolidated_weather[
                                i
                              ].applicable_date.slice(9, 10)
                            : item.res.consolidated_weather[
                                i
                              ].applicable_date.slice(8, 10)}{" "}
                          {getMyMonth(
                            item.res.consolidated_weather[i].applicable_date
                          )}
                        </h6>
                      )}
                      <img
                        className="weather-image"
                        src={`https://www.metaweather.com/static/img/weather/${item.res.consolidated_weather[i].weather_state_abbr}.svg`}
                        alt="weather state"
                      />
                      <h6>
                        {item.res.consolidated_weather[i].weather_state_name}
                      </h6>
                      <h6>
                        {item.res.consolidated_weather[i].the_temp &&
                          item.res.consolidated_weather[i].the_temp.toFixed(1)}
                        C
                      </h6>
                      <h6>
                        Predictability:{" "}
                        {item.res.consolidated_weather[i].predictability &&
                          item.res.consolidated_weather[i].predictability}
                        %
                      </h6>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});
export default connect(mapStateToProps, { addItem })(WeatherList);
