import { AESDecrypt } from "cookie-cryptr";
import { Component } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import superagent from "superagent";
import Cookies from "universal-cookie";

class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      mainData: {},
      searchData: "",
      userId: "",
      showUpdate: false,
      name: "",
      mobile: "",
      email: "",
      role: "",
      isAlert: false,
      alertType: "",
      alertMessage: "",
    };
  }

  componentDidMount() {
    superagent
      .get(
        "http://sbmusermanagement-env.eba-h2s2jmtn.us-west-2.elasticbeanstalk.com/user"
      )
      .set(
        "Authorization",
        `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
      )
      .then((res) => {
        console.log(res);
        this.setState({
          mainData: res.body.payload,
        });
      })
      .catch(console.error);
  }

  render() {
    let handleUpdateClose = () => {
      this.setState({
        showUpdate: false,
        isAlert: false,
        alertType: "",
        alertMessage: "",
      });
    };
    let searchUser = async (e) => {
      e.preventDefault();
      superagent
        .get(
          `http://sbmusermanagement-env.eba-h2s2jmtn.us-west-2.elasticbeanstalk.com/user/${this.state.userId}`
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          console.log(res);
          this.setState({
            searchData: res.body.payload,
          });
        })
        .catch((err) => {
          console.error(err.response);
          this.setState({
            isAlert: true,
            alertType: "danger",
            alertMessage: err.response.body.message,
          });
        });
    };

    let update = async (e) => {
      e.preventDefault();
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
          email: this.state.email,
          mobile: this.state.mobile,
          role: this.state.role,
        })
        .then((res) => {
          console.log(res);
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: res.body.message,
          });
        })
        .catch((err) => {
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: err.response.message,
          });
        });
    };

    return (
      <Container className="text-secondary mt-4" fluid>
        {/* Update user modal */}
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
              <div className="form-group">
                <label for="role">User authorization</label>
                <select
                  className="form-control"
                  id="serviceType"
                  value={this.state.role}
                  onChange={(e) => {
                    this.setState({
                      role: e.target.value,
                    });
                  }}
                  required
                >
                  <option value="default">Select an option</option>
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>
              <Form.Group className="mb-3" controlId="mobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={this.state.mobile}
                  value={this.state.mobile}
                  onChange={(e) => this.setState({ mobile: e.target.value })}
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
        {this.state.isAlert ? (
          <Alert key={this.state.alertType} variant={this.state.alertType}>
            {this.state.alertMessage}
          </Alert>
        ) : (
          <></>
        )}
        <Row>
          <Col>
            <h3>User Database</h3>
          </Col>
          <div className="col-md-3">
            <Form onSubmit={searchUser}>
              <div className="input-group rounded">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Search by user id"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onChange={(e) => {
                    this.setState({
                      userId: e.target.value,
                    });
                  }}
                />
                <button
                  className="btn btn-outline-secondary input-group-text border-0"
                  id="search-addon"
                  type="submit"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </Form>
          </div>
        </Row>
        <hr />
        {this.state.userId !== "" && this.state.searchData !== "" ? (
          <Card className="mx-5">
            <Card.Body>
              <Row>
                <div className="col-md-2 d-flex justify-content-center">
                  {this.state.searchData.gender === "Male" ? (
                    <Image
                      src={require("../../Images/male-dummy.png")}
                      fluid
                      width={"100"}
                    />
                  ) : (
                    <>
                      <Image
                        src={require("../../Images/female-dummy.png")}
                        width={"80"}
                        fluid
                      />
                    </>
                  )}
                </div>
                <Col className="d-md-block text-center text-md-left">
                  <Card.Title>{this.state.searchData.name}</Card.Title>
                  <Card.Subtitle>{this.state.searchData.email}</Card.Subtitle>
                  <Card.Text>
                    <h6>
                      Mobile Number: {this.state.searchData.mobile}
                      <br />
                      {new Date(
                        this.state.searchData.registrationDate
                      ).toDateString()}
                    </h6>
                  </Card.Text>
                </Col>
                <div className="col-md-2">
                  <button
                    className="btn btn-block btn-outline-danger"
                    onClick={() => {
                      this.setState({ showUpdate: true });
                    }}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                </div>
              </Row>
            </Card.Body>
          </Card>
        ) : (
          <>
            {this.state.mainData.length > 0 ? (
              this.state.mainData.map((item, key) => (
                <Card key={key} className="mx-5 mb-3">
                  <Card.Body>
                    <Row>
                      <div className="col-md-2 d-flex justify-content-center">
                        {item.gender === "Male" ? (
                          <Image
                            src={require("../../Images/male-dummy.png")}
                            fluid
                            width={"100"}
                          />
                        ) : (
                          <>
                            <Image
                              src={require("../../Images/female-dummy.png")}
                              width={"100"}
                              fluid
                            />
                          </>
                        )}
                      </div>
                      <Col className="d-md-block text-center text-md-left">
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Subtitle>{item.email}</Card.Subtitle>
                        <Card.Text>
                          <h6>
                            Mobile Number: {item.mobile}
                            <br />
                            {new Date(item.registrationDate).toDateString()}
                          </h6>
                        </Card.Text>
                      </Col>
                      <div className="col-md-2">
                        <button
                          className="btn btn-block btn-outline-danger"
                          onClick={() => {
                            this.setState({
                              showUpdate: true,
                              name: item.name,
                              mobile: item.mobile,
                              email: item.email,
                              role: item.role,
                            });
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <></>
            )}
          </>
        )}
      </Container>
    );
  }
}

export default ListUsers;
