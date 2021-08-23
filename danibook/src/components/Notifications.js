import React, { Component } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { getNotifications } from "../Redux/Actions/user_actions";
import { getDani } from "../Redux/Actions/data_actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentContainer from "./CommentContainer";
class Notifications extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      daniId: null,
    };
  }

  handleShow = (idDani) => {
    this.setState({ show: true });
    this.props.getDani(idDani);
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  render() {
    dayjs.extend(relativeTime);
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <button
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
          let unreadNotifications = this.props.notifications;
          this.props.getNotifications(unreadNotifications);
        }}
      >
        {children}
        &#x25bc;
      </button>
    ));
    const { notifications, loading } = this.props;
    let iconClass = "";
    if (notifications && notifications.length > 0) {
      if (
        notifications.filter((notification) => notification.read === false) > 0
      ) {
        iconClass = "green";
      } else {
        iconClass = "";
      }
    }

    let notificationsView = [];
    if (!loading && notifications.length > 0) {
      notifications.map((notification) => {
        const type =
          notification.type === "like"
            ? "liked your dani "
            : notification.type === "comment"
            ? "commented on your dani "
            : "posted you a dani ";
        const time = dayjs(notification.createdAt).fromNow();
        notificationsView.push({
          createdAt: notification.createdAt,
          sender: notification.sender,
          type: type,
          time: time,
          daniId: notification.daniId,
          class: notification.read ? "read" : "unread",
        });
        return true;
      });
    }
    return (
      <div>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <div className="icon-notification">
              <FontAwesomeIcon icon={faBell} />
              <span className={"badge " + iconClass} />
            </div>
          </Dropdown.Toggle>
          {notificationsView.length > 0 ? (
            <Dropdown.Menu>
              {notificationsView.map((notification) => {
                return (
                  <Dropdown.Item
                    onClick={() => this.handleShow(notification.daniId)}
                    key={notification.createdAt}
                    className={notification.class}
                  >
                    {notification.sender} {notification.type}{" "}
                    {notification.time}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          ) : (
            ""
          )}
        </Dropdown>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-12">
                <div className="card ">
                  <div className="card-header align-items-start justify-content-between flex">
                    <div className="list-unstyled comment-list">
                      <div className="media">
                        <span className="message_userpic">
                          <img
                            className="d-flex mr-3"
                            src={this.props.dani.userImage}
                            alt=""
                          />
                          <span className="user-status bg-success "></span>
                        </span>
                        <div className="media-body">
                          <h6 className="mt-0 mb-1">
                            {this.props.dani.userHandle}
                          </h6>
                          {dayjs(this.props.dani.createdAt).fromNow()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-block comment-post-container">
              <p>{this.props.dani.body}</p>
            </div>
            {this.props.dani.comments &&
              this.props.dani.comments.map((comment, index) => {
                return (
                  <div
                    key={index}
                    className="card-header media comment-container"
                  >
                    <span className="message_userpic">
                      <img
                        className="d-flex mr-3"
                        src={comment.userImage}
                        alt="Genericuser"
                      />
                      <span className="user-status bg-success "></span>
                    </span>
                    <div className="media-body">
                      <h6 className="mt-0 mb-1">
                        {comment.userHandle}
                        <small className="pull-right">
                          {dayjs(comment.createdAt).fromNow()}
                        </small>
                      </h6>
                      <p className="description">{comment.body}</p>
                    </div>
                  </div>
                );
              })}
            <CommentContainer
              daniId={this.props.dani.daniId}
              userImage={this.props.user.usrData.imageURL}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

Notifications.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  getDani: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
  loading: state.user.loading,
  dani: state.data.dani,
  user: state.user,
});
const mapActionsToProps = {
  getNotifications,
  getDani,
};

export default connect(mapStateToProps, mapActionsToProps)(Notifications);
