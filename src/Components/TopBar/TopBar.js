import { AESDecrypt } from "cookie-cryptr";
import { Component } from "react";
import Cookies from "universal-cookie";
import superagent from "superagent";
import TopBarAdmin from "./TopBarAdmin";
import TopBarUser from "./TopBarUser";
import { Navigate } from "react-router-dom";

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      validStatus: false,
      role: "",
    };
  }

  componentDidMount() {
    if (this.state.cookies.get("token")) {
      superagent
        .get(
          " http://sbmauthapp-env.eba-9pddynji.us-west-2.elasticbeanstalk.com/validate"
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          this.setState({
            role: res.body.userRole,
          });
        })
        .catch((err) => {
          console.error(err.response.body);
        });
    }
  }

  render() {
    return (
      <>
        {this.state.cookies.get("token") ? (
          this.state.role.match("ROLE_ADMIN") ? (
            <TopBarAdmin />
          ) : (
            <TopBarUser />
          )
        ) : (
          <Navigate to="/login" />
        )}
      </>
    );
  }
}

export default TopBar;
