import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login, loadUser, logout } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
class Login extends Component {
  state = {
    email: "",
    password: "",
    msg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object,
    login: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
  };
  onLogout = () => {
    this.props.logout();
  };
  // get recent errors
  componentDidUpdate(prevProps) {
    //   see if error props has changed
    const { error } = this.props;
    if (error !== prevProps.error) {
      //   check for register error
      if (error && error.id === "LOGIN_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  // submit login
  onSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const user = {
      email,
      password
    };
    // attempt to login
    this.props.login(user, this.props.history);
    // this.props.history.push("/");
    this.props.loadUser();
  };
  render() {
    // console.log(this.state.msg);
    const { user } = this.props.auth;

    return (
      <div>
        {this.props.isAuthenticated ? (
          <div>
            <h1>Hi {user.name}, you are logged in!</h1>
            <Button
              variant="outlined"
              color="primary"
              className="logout-button"
              onClick={this.onLogout}
            >
              Log me out
            </Button>
          </div>
        ) : (
          <div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="register-container">
                <h1>Login</h1>
                {this.state.msg ? (
                  <span className="red-text">{this.state.msg}</span>
                ) : null}

                <TextField
                  required
                  id="register-email"
                  label="Email Required"
                  className="my-form"
                  margin="normal"
                  variant="outlined"
                  name="email"
                  onChange={this.handleChange}
                  autoComplete="on"
                />
                {/* <span className="red-text">{errors.email}</span> */}
                <TextField
                  required
                  id="register-password"
                  label="Password Required"
                  className="my-form"
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                  variant="outlined"
                  name="password"
                  onChange={this.handleChange}
                />
                {/* <span className="red-text">{errors.password}</span> */}

                {/* <span className="red-text">{errors.password2}</span> */}
                <Button
                  className="my-btn"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  auth: state.auth
});

export default connect(mapStateToProps, { login, loadUser, logout })(
  withRouter(Login)
);
