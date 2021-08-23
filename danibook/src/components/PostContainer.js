import "../assets/css/dark_blue_adminux.css";
import "../assets/css/font-awesome.min.css";
import React, { Component } from "react";
import { Form } from "react-bootstrap";
//Redux
import { connect } from "react-redux";
import { PostDani, clearErrors } from "../Redux/Actions/data_actions";
import { PropTypes } from "prop-types";

class PostContainer extends Component {
  state = {
    body: "",
    destinyHandle: "",
    errors: {},
  };

  componentDidMount() {
    const { destinyHandle } = this.props;
    if (destinyHandle !== undefined) {
      this.setState({ destinyHandle });
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: [event.target.value],
    });
  };

  submitDani = (event) => {
    event.preventDefault();
    this.props.PostDani({
      body: this.state.body,
      destinyHandle: this.state.destinyHandle,
    });
    this.setState({ body: "", destinyHandle: "" });
    this.props.clearErrors();
  };

  render() {
    return (
      <div className="row post-container">
        <div className="col-12">
          <Form onSubmit={this.submitDani}>
            <div className="card full-screen-container ">
              <div className="card-block p-0">
                <div className="list-unstyled comment-list p-0">
                  <div className="media comment">
                    <span className="message_userpic">
                      <img
                        className="d-flex mr-3"
                        src={this.props.userImg}
                        alt=""
                      />
                      <span className="user-status bg-success "></span>
                    </span>
                    <div className="media-body">
                      <Form.Control
                        as="textarea"
                        rows="5"
                        className="form-control"
                        placeholder="Whats in your mind..."
                        name="body"
                        value={this.state.body}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer justify-content-between d-flex">
                <ul className="nav pull-left" />
                <button className="btn btn-primary " type="submit">
                  Post
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

PostContainer.propTypes = {
  PostDani: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.Ui,
  userImg: state.user.usrData.imageURL,
});

const mapStateToActions = {
  PostDani,
  clearErrors,
};

export default connect(mapStateToProps, mapStateToActions)(PostContainer);
