import { Component } from "react";
import { Container } from "react-bootstrap";
import Bottom from "../LandingPage/Bottom";
import TopBar from "../TopBar/TopBar";
import superagent from "superagent";
import { AESDecrypt } from "cookie-cryptr";
import Cookies from "universal-cookie";
import PageNotFound from "../PageNotFound";
import AllReports from "./AllReports";

class ReportsAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyProductRequest: false,
      currentUserRole: "",
      cookies: new Cookies(),
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
            currentUserRole: res.body.userRole,
          });
        })
        .catch(console.error);
    }
  }

  render() {
    return (
      <>
        {this.state.currentUserRole === "ROLE_ADMIN" ? (
          <>
            <TopBar />
            <Container className="mt-4" fluid>
              <AllReports />
            </Container>
            <Bottom />
          </>
        ) : (
          <PageNotFound />
        )}
      </>
    );
  }
}

export default ReportsAdmin;
