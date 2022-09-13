import { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Bottom from "../LandingPage/Bottom";
import TopBar from "../TopBar/TopBar";
import superagent from "superagent";
import { AESDecrypt } from "cookie-cryptr";
import Cookies from "universal-cookie";
import MyRequest from "./MyRequests";
import MyServices from "./MyServices";
import ServiceAdmin from "./ServicesAdmin";

class Services extends Component {
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
    let toggleMode = () => {
      if (this.state.isMyProductRequest) {
        this.setState({
          isMyProductRequest: false,
        });
      } else {
        this.setState({
          isMyProductRequest: true,
        });
      }
    };

    return (
      <>
        <TopBar />
        {this.state.currentUserRole === "ROLE_ADMIN" ? (
          <ServiceAdmin />
        ) : (
          <Container className="mt-3 p-2 px-4 text-secondary" fluid>
            <Row>
              <Col>
                {this.state.isMyProductRequest ? (
                  <h2>My Product's Service</h2>
                ) : (
                  <h2>My Requests</h2>
                )}
              </Col>
              <div className="col-3">
                <button
                  className="btn btn-outline-primary btn-block"
                  onClick={toggleMode}
                >
                  {this.state.isMyProductRequest ? (
                    <>
                      <span className="d-none d-md-block">My Requests</span>
                      <i className="d-block d-md-none fa-regular fa-handshake"></i>
                    </>
                  ) : (
                    <>
                      <span className="d-none d-md-block">
                        My Product's Request
                      </span>

                      <i className="d-block d-md-none fa-solid fa-briefcase"></i>
                    </>
                  )}
                </button>
              </div>
            </Row>
            <hr />
            {this.state.isMyProductRequest ? <MyServices /> : <MyRequest />}
          </Container>
        )}
        <Bottom />
      </>
    );
  }
}

export default Services;
