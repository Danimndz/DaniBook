import React from "react";
import "../assets/css/dark_blue_adminux.css";
import "../assets/css/font-awesome.min.css";
import { NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { Modal, Button, Nav } from "react-bootstrap";
//Redux
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { logoutUser, updateUinfo } from "../Redux/Actions/user_actions";
import EditProfileForm from "./EditForm";
import Notifications from "./Notifications";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };
  }

  handleSubmit = (values) => {
    const userD = {
      bio: values.bio,
      website: values.website,
      location: values.location,
    };
    this.props.updateUinfo(userD);
    this.handleClose();
  };

  LogOut = () => {
    this.props.logoutUser();
  };

  editProfile = () => {};
  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  // componentDidMount() {
  //   const usr = this.props.user.usrData;
  // }

  render() {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <button
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
        &#x25bc;
      </button>
    ));
    return (
      <header className="navbar-fixed">
        <nav className="navbar navbar-toggleable-md navbar-inverse bg-faded">
          <div className="sidebar-left">
            <NavLink className="returnHome navbar-brand" exact to="/">
              <span className="fa fa-trophy"></span>
              <span className="hidden-xs-down"> DaniBook</span>
            </NavLink>
          </div>
          <div className="d-flex mr-auto"> &nbsp;</div>
          <div className="notifications">
            <Notifications />
          </div>
          <ul className="navbar-nav content-right">
            <li className="nav-item">
              <Nav.Item>
                <Nav.Link href={"/profile/" + this.props.user.usrData.handle}>
                  <span className="message_userpic">
                    <img
                      className="d-flex mr-3"
                      src={this.props.user.usrData.imageURL}
                      alt="user"
                    />
                  </span>
                </Nav.Link>
              </Nav.Item>
            </li>
          </ul>
          <div className="sidebar-right">
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle}>Settings</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Button
                    className="btn btn-light"
                    variant="primary"
                    onClick={this.handleShow}
                  >
                    Edit Profile
                  </Button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button className="btn btn-light" onClick={this.LogOut}>
                    LogOut
                  </button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </nav>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditProfileForm onSubmit={this.handleSubmit} />
          </Modal.Body>
        </Modal>
      </header>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  updateUinfo: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
});
const mapActionsToProps = {
  logoutUser,
  updateUinfo,
};
export default connect(mapStateToProps, mapActionsToProps)(Header);
