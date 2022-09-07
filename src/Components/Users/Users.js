import { Component } from "react";
import Cookies from "universal-cookie";
import Bottom from "../LandingPage/Bottom";
import TopBarAdmin from "../TopBar/TopBarAdmin";
import superagent from "superagent";
import { AESDecrypt } from "cookie-cryptr";
import PageNotFound from "../PageNotFound";
import ListUsers from "./ListUsers";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserRole: "",
      cookies: new Cookies(),
    };
  }

  componentDidMount() {
    superagent
      .get("http://localhost:8001/validate")
      .set(
        "Authorization",
        `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
      )
      .then((res) => {
        this.setState({
          currentUserRole: res.body.userRole,
        });
      })
      .catch(console.error);
  }

  render() {
    return (
      <>
        {this.state.currentUserRole === "ROLE_ADMIN" ? (
          <>
            <TopBarAdmin />
            <ListUsers />
            <Bottom />
          </>
        ) : (
          <PageNotFound />
        )}
      </>
    );
  }
}

export default Users;
