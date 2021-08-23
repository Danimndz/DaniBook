import React, { Component } from "react";
import Header from "../components/Header";
import cover from "../assets/img/cover.jpg";
import daniProxy from "../patterns/proxy";
import { connect } from "react-redux";
import { UploadImage } from "../Redux/Actions/user_actions";
import { getDanisS } from "../Redux/Actions/data_actions";
import { PropTypes } from "prop-types";
import Postcard from "../components/Postcard";
import PostContainer from "../components/PostContainer";
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const apiurl = "https://us-central1-danibook-983c2.cloudfunctions.net/api";
//redux

const prox = new daniProxy(proxyurl, apiurl);
class Profiles extends Component {
  state = {
    user: null,
    MainUser: null,
    danis: null,
  };

  componentDidMount() {
    this.props.getDanisS();
    const route = this.props.location.pathname.split("/");
    const handle = route[2];
    prox
      .getOtherUData(`/user/${handle}`)
      .then((res) => {
        this.setState({
          user: res.user,
          danis: res.danis,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate() {
    const user = this.props.user;
    if (!user.loading && this.state.MainUser === null) {
      this.setState({
        MainUser: user.usrData,
      });
    }
    if (!user.loading && this.state.MainUser !== null) {
      const img = user.usrData.imageURL;
      if (img !== this.state.MainUser.imageURL) {
        this.setState({
          MainUser: user.usrData,
        });
        window.location.reload();
      }
    }
  }

  ChangeImage = (event) => {
    const image = event.target.files[0];
    //send to server
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.UploadImage(formData);
  };

  editPhoto = () => {
    const fileInput = document.getElementById("changeImage");
    fileInput.click();
  };

  render() {
    const { danis } = this.props.data;
    return (
      <div>
        <Header />
        {this.state.user === null ? (
          <div>
            <div>
              <p>loading profile...</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="row social-profile-cover">
              <img className="background" src={cover} alt="" />
              <div className="container mb-2">
                <div className="row  align-items-center p-2">
                  <img
                    className="social-profile-pic"
                    src={this.state.user.imageURL}
                    alt=""
                  />
                  <div className="col-sm-16 profile-name">
                    <h2>{this.state.user.handle}</h2>
                    <p>{this.state.user.location}</p>
                  </div>
                  <div className="col-12 col-sm-16 text-right flex-row "></div>
                </div>
                {this.state.MainUser &&
                this.state.MainUser.handle === this.state.user.handle ? (
                  <div className="changeImage">
                    <input
                      type="file"
                      id="changeImage"
                      hidden="hiden"
                      onChange={this.ChangeImage}
                    ></input>
                    <button className="btn btn-info" onClick={this.editPhoto}>
                      change photo
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="card full-screen-container">
              <div className="card-block">
                <dl className="row full-width">
                  <dt className="col-12"></dt>
                  <dt className="col-12">Bio</dt>
                  <dd className="col-12">{this.state.user.bio}</dd>
                  <dt className="col-12">Website</dt>
                  <dd className="col-12">{this.state.user.website}</dd>
                  <dt className="col-12 text-truncate">email</dt>
                  <dd className="col-12">{this.state.user.email}</dd>
                </dl>
              </div>
            </div>
            <PostContainer destinyHandle={this.state.user.handle} />
            {
              danis.map( dani => {
                if(dani.destinyHandle === this.state.user.handle){
                  return(
                    <Postcard key={dani.daniId} dani={dani} />
                  )
                }
                return true;
              })
            }
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

const mapActionsToProps = {
  UploadImage,
  getDanisS,
};

Profiles.propTypes = {
  user: PropTypes.object.isRequired,
  UploadImage: PropTypes.func.isRequired,
  getDanisS: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapActionsToProps)(Profiles);
