import { Component } from "react";
import Cookies from "universal-cookie";
import TopBar from "../TopBar/TopBar.js";
import superagent from "superagent";
import { AESDecrypt } from "cookie-cryptr";
import DashBoardUser from "./DashBoardUser.js";
import DashBoardAdmin from "./DashBoardAdmin";
import { Navigate } from "react-router-dom";
import Bottom from "../LandingPage/Bottom.js";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
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
            <>
              <TopBar />
              <DashBoardAdmin />
              <Bottom />
            </>
          ) : (
            <>
              <TopBar />
              <DashBoardUser />
              <Bottom />
            </>
          )
        ) : (
          <Navigate to="/login" />
        )}
      </>
    );
  }
}

export default Dashboard;
