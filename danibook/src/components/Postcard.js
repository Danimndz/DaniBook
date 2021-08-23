import React, { Component } from "react";
import "../assets/css/dark_blue_adminux.css";
import "../assets/css/font-awesome.min.css";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Modal, Nav } from "react-bootstrap";
import relativeTime from "dayjs/plugin/relativeTime";
import { connect } from "react-redux";
import { likeDani, unlikeDani, getDani } from "../Redux/Actions/data_actions";
import { PropTypes } from "prop-types";
import CommentContainer from "./CommentContainer";
class Postcard extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      showComments: false,
    };
  }
  isLiked = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.daniId === this.props.dani.daniId
      )
    )
      return true;
    else return false;
  };
  handleShow = () => {
    this.setState({
      show: true,
      showComments: true,
    });
    this.props.getDani(this.props.dani.daniId);
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  likeDani = () => {
    this.props.likeDani(this.props.dani.daniId);
  };

  unLikeDani = () => {
    this.props.unlikeDani(this.props.dani.daniId);
  };
  render() {
    dayjs.extend(relativeTime);
    const {
      dani: {
        body,
        createdAt,
        userHandle,
        destinyHandle,
        userImage,
        likeCount,
        commentCount,
        // daniId,
      },
    } = this.props;
    const likeButton = this.isLiked() ? (
      <button className="btn  text-primary mr-2" onClick={this.unLikeDani}>
        <i className="fa fa-heart text-danger"></i>
        <span className="text-white"> {likeCount}</span>
      </button>
    ) : (
      <button className="btn  text-primary mr-2" onClick={this.likeDani}>
        <i className="fa fa-heart-o text-danger"></i>
        <span className="text-white"> {likeCount}</span>
      </button>
    );
    return (
      <div className="postcard-container">
        <div className="row">
          <div className="col-md-12">
            <div className="card ">
              <div className="card-header align-items-start justify-content-between flex">
                <div className="list-unstyled comment-list">
                  <div className="media">
                    <span className="message_userpic">
                      <img className="d-flex mr-3" src={userImage} alt="" />
                      <span className="user-status bg-success "></span>
                    </span>
                    <div className="media-body">
                      <Nav.Link
                        href={"profile/" + userHandle}
                        className="mt-0 mb-1"
                      >
                        {userHandle === destinyHandle ? (
                          <p>{userHandle}</p>
                        ) : (
                          <p>
                            {userHandle}{destinyHandle}
                          </p>
                        )}
                      </Nav.Link>
                      {dayjs(createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-block">
          <p>{body}</p>
        </div>
        <div className="row"></div>
        <div className="col post-options">
          {likeButton}
          <Button onClick={this.handleShow} className="mr-2" variant="link">
            <i className="fa fa-comments text-warning"></i>
            <span className="text-white"> {commentCount}</span>
          </Button>
        </div>
        {/* //////////////////////////////////////////////commentModal///////////////////////////////////////////////////////////////////// */}
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
                            src={this.props.data.dani.userImage}
                            alt=""
                          />
                          <span className="user-status bg-success "></span>
                        </span>
                        <div className="media-body">
                          <h6
                            className="mt-0 mb-1"
                            component={Link}
                            to={"/profile/:" + userHandle}
                          >
                            {this.props.data.dani.userHandle}
                          </h6>
                          {dayjs(this.props.data.dani.createdAt).fromNow()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-block comment-post-container">
              <p>{this.props.data.dani.body}</p>
            </div>
            {this.props.data.dani.comments &&
              this.props.data.dani.comments.map((comment, index) => {
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
              daniId={this.props.data.dani.daniId}
              userImage={this.props.user.usrData.imageURL}
              commentCount={commentCount}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

Postcard.propTypes = {
  user: PropTypes.object.isRequired,
  likeDani: PropTypes.func.isRequired,
  unlikeDani: PropTypes.func.isRequired,
  dani: PropTypes.object.isRequired,
  getDani: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
  UI: state.UI,
});
const mapActionsToProps = {
  likeDani,
  unlikeDani,
  getDani,
};
export default connect(mapStateToProps, mapActionsToProps)(Postcard);
