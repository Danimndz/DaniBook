import React, { Component } from "react";
// import axios from "axios";
import Postcard from "../components/Postcard";
import Header from "../components/Header";
import PostContainer from "../components/PostContainer";
//Redux
import { connect } from "react-redux";
import { getDanisS } from "../Redux/Actions/data_actions";
import PropTypes from "prop-types";

class home extends Component {
  async componentDidMount() {
    await this.props.getDanisS();
  }

  render() {
    const { danis } = this.props.data;
    return (
      <div>
        <Header />
        {!this.props.user.loading ? (
          <PostContainer destinyHandle={this.props.user.usrData.handle} />
        ) : (
          ""
        )}
        {danis.map((dani) => {
          return <Postcard key={dani.daniId} dani={dani} />;
        })}
      </div>
    );
  }
}
home.propTypes = {
  getDanisS: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user,
});

const mapActionsToProps = {
  getDanisS,
};
export default connect(mapStateToProps, mapActionsToProps)(home);
