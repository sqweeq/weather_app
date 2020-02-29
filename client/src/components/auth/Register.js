import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    msg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object,
    register: PropTypes.func.isRequired
  };
  componentDidUpdate(prevProps) {
    //   see if error props has changed
    const { error } = this.props;
    if (error !== prevProps.error) {
      //   check for register error
      if (error && error.id === "REGISTER_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }
  //   static getDerivedStateFromProps(nextProps) {
  //     if (nextProps.isAuthenticated) {
  //       this.props.history.push("/");
  //     }
  //   }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { name, email, password } = this.state;
    // create new user
    const newUser = {
      name,
      email,
      password
    };

    // attempt to register
    this.props.register(newUser, this.props.history);
  };
  render() {
    // console.log(this.state.msg);

    return (
      <div>
        {/* {this.state.msg ? <div>{this.state.msg}</div> : null} */}
        <form noValidate onSubmit={this.handleSubmit}>
          <div className="register-container">
            <h1>Register</h1>
            {this.state.msg ? (
              <span className="red-text">{this.state.msg}</span>
            ) : null}
            <TextField
              required
              id="register-name"
              label="Name Required"
              className="my-form"
              margin="normal"
              variant="outlined"
              name="name"
              onChange={this.handleChange}
              autoComplete="on"
            />
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
              Register
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { register })(withRouter(Register));
