import { AESDecrypt } from "cookie-cryptr";
import { Component } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  Image,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Cookies from "universal-cookie";
import Bottom from "../LandingPage/Bottom";
import TopBar from "../TopBar/TopBar";
import superagent from "superagent";
import { Navigate } from "react-router-dom";
import LoadingPage from "../LoadingPage";

class AboutMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      cookies: new Cookies(),
      name: "",
      mobile: "",
      oldPassword: "",
      newPassword: "",
      isAlert: false,
      alertType: "",
      alertMessage: "",
      isLoader: false,
    };
  }

  componentDidMount() {
    if (this.state.cookies.get("token")) {
      this.setState({ isLoader: true });
      superagent
        .get(
          "http://sbmusermanagement-env.eba-h2s2jmtn.us-west-2.elasticbeanstalk.com/user/me"
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          this.setState({
            result: res.body.payload,
            showChangePassword: false,
            showUpdate: false,
            name: res.body.payload.name,
            mobile: res.body.payload.mobile,
            isLoader: false,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  render() {
    let handlePasswordClose = () => {
      this.setState({
        showChangePassword: false,
      });
    };

    let handleUpdateClose = () => {
      this.setState({
        showUpdate: false,
      });
    };

    let update = async (e) => {
      e.preventDefault();
      this.setState({ isLoader: true });
      superagent
        .put(
          "http://sbmusermanagement-env.eba-h2s2jmtn.us-west-2.elasticbeanstalk.com/user"
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .send({
          name: this.state.name,
          email: this.state.result.email,
          mobile: this.state.mobile,
        })
        .then((res) => {
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: res.body.message,
            isLoader: false,
          });
        })
        .catch((err) => {
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: err.response.message,
            isLoader: false,
          });
        });
    };

    let changePassword = async (e) => {
      e.preventDefault();
      this.setState({ isLoader: true });
      superagent
        .put(
          " http://sbmauthapp-env.eba-9pddynji.us-west-2.elasticbeanstalk.com/change-password"
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .send({
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword,
        })
        .then((res) => {
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: res.text,
            isLoader: false,
          });
        })
        .catch((err) => {
          console.error(err.response);
          this.setState({
            isAlert: true,
            alertType: "danger",
            alertMessage: err.response.text,
            isLoader: false,
          });
        });
    };
    return (
      <>
        {this.state.cookies.get("token") ? (
          <>
            {this.state.isLoader ? <LoadingPage /> : <></>}
            {/* Change Password Modal */}
            <Modal
              show={this.state.showChangePassword}
              onHide={handlePasswordClose}
            >
              {this.state.isAlert ? (
                <Alert
                  className="mb-1"
                  key={this.state.alertType}
                  variant={this.state.alertType}
                >
                  {this.state.alertMessage}
                </Alert>
              ) : (
                <></>
              )}
              <Modal.Header>
                <Modal.Title>Change Password</Modal.Title>
              </Modal.Header>
              <Form onSubmit={changePassword}>
                <Modal.Body>
                  <Form.Group className="mb-3" controlId="currentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your old password"
                      onChange={(e) =>
                        this.setState({ oldPassword: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="New Password"
                      onChange={(e) =>
                        this.setState({ newPassword: e.target.value })
                      }
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handlePasswordClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="outline-primary">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
            {/* Update Details Modal */}
            <Modal show={this.state.showUpdate} onHide={handleUpdateClose}>
              {this.state.isAlert ? (
                <Alert
                  className="mb-1"
                  key={this.state.alertType}
                  variant={this.state.alertType}
                >
                  {this.state.alertMessage}
                </Alert>
              ) : (
                <></>
              )}
              <Modal.Header>
                <Modal.Title className="text-secondary">
                  Update Profile Details
                </Modal.Title>
              </Modal.Header>
              <Form onSubmit={update}>
                <Modal.Body>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={this.state.name}
                      value={this.state.name}
                      onChange={(e) => this.setState({ name: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="mobile">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder={this.state.mobile}
                      value={this.state.mobile}
                      onChange={(e) =>
                        this.setState({ mobile: e.target.value })
                      }
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleUpdateClose}>
                    Close
                  </Button>
                  <Button type="submit" variant="outline-primary">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
            <TopBar />
            {/* Main About me */}
            <Container className="mt-5 mb-3 text-secondary">
              <Row>
                <div className="col-md-5 d-flex justify-content-center">
                  {this.state.result.gender === "Male" ? (
                    <Image
                      src={require("../../Images/male-dummy.png")}
                      fluid
                      width={"380"}
                    />
                  ) : (
                    <>
                      <Image
                        src={require("../../Images/female-dummy.png")}
                        width={"380"}
                        fluid
                      />
                    </>
                  )}
                </div>
                <div className="col-md-7 mt-4 mt-md-1">
                  <h2 className="text-center text-md-left">About Me</h2>
                  <Table className="text-center text-md-left">
                    <tbody>
                      <tr>
                        <td>
                          <h5>Name</h5>
                        </td>
                        <td>
                          <h5>
                            {AESDecrypt(this.state.cookies.get("name"), "test")}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h5>Birthdate</h5>
                        </td>
                        <td>
                          <h5>
                            {new Date(
                              this.state.result.birthDate
                            ).toDateString()}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h5>Email Id</h5>
                        </td>
                        <td>
                          <h5>{this.state.result.email}</h5>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h5>Mobile Number</h5>
                        </td>
                        <td>
                          <h5>{this.state.result.mobile}</h5>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h5>Registration Date</h5>
                        </td>
                        <td>
                          <h5>
                            {new Date(
                              this.state.result.registrationDate
                            ).toDateString()}
                          </h5>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Row>
                    <div className="col-md">
                      <button
                        className="btn btn-block btn-outline-primary"
                        onClick={() => {
                          this.setState({ showChangePassword: true });
                        }}
                      >
                        Change Password
                      </button>
                    </div>
                    <div className="col-md mt-2 mt-md-0">
                      <button
                        className="btn btn-block btn-outline-danger"
                        onClick={() => {
                          this.setState({ showUpdate: true });
                        }}
                      >
                        Update Details
                      </button>
                    </div>
                  </Row>
                </div>
              </Row>
            </Container>
            <Bottom />
          </>
        ) : (
          <Navigate to="/login" />
        )}
      </>
    );
  }
}

export default AboutMe;
