import React, { Component } from "react";
import "../assets/css/dark_blue_adminux.css";
import "../assets/css/font-awesome.min.css";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { postComments } from "../Redux/Actions/data_actions";
import { PropTypes } from "prop-types";

class CommentContainer extends Component {
  constructor() {
    super();
    this.state = {
      body: "",
    };
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  submitComment = (event) => {
    event.preventDefault();
    this.props.postComments(this.props.daniId, { body: this.state.body });
    this.setState({ body: "" });
  };

  render() {
    const { userImage } = this.props;
    return (
      <div className="media comment new-comment-container">
        <Form onSubmit={this.submitComment}>
          <div className="input-container">
            <span className="message_userpic">
              <img className="d-flex mr-3" src={userImage} alt="user" />
              <span className="user-status bg-success "></span>
            </span>
            <div className="media-body">
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Write comment"
                name="body"
                value={this.state.body}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">
            Comment
          </button>
        </Form>
      </div>
    );
  }
}

CommentContainer.propTypes = {
  postComments: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  userImage: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  ui: state.UI,
});
const mapActionsToProps = {
  postComments,
};
export default connect(mapStateToProps, mapActionsToProps)(CommentContainer);
