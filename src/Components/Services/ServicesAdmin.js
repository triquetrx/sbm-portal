import { AESDecrypt } from "cookie-cryptr";
import { Component } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Cookies from "universal-cookie";
import superagent from "superagent";
import MyProductRequest from "./MyProductServices";

class ServiceAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyProductRequest: false,
      currentUserRole: "",
      cookies: new Cookies(),
      searchByUserData: {},
      searchFor: "",
      showMore: false,
      requestId: "",
      requestData: {},
      productDetails: {},
      currentUser: "",
      user: {},
      productId: "",
      detailsReady: false,
      showReport: false,
      serviceType: "",
      actionTaken: "",
      diagnosisDetails: "",
      paid: "",
      visitFees: "",
      repairDetails: "",
      isAlert: false,
      alertMessage: "",
      alertType: "",
      isFilterStatus: false,
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
            currentUser: res.body.email,
          });
        })
        .catch(console.error);
    }
  }

  render() {
    let searchByUser = (e) => {
      e.preventDefault();
      superagent
        .get(
          `http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq/${this.state.searchFor}`
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          console.log(res);
          this.setState({
            searchByUserData: res.body.payload,
          });
        })
        .catch(console.error);
    };

    const handleClose = () => {
      this.setState({
        showMore: false,
      });
    };

    let fetchProductDetails = () => {
      if (this.state.detailsReady) {
        this.setState({
          detailsReady: false,
        });
      } else {
        superagent
          .get(
            `http://localhost:8003/product/${this.state.requestData.productId}`
          )
          .set(
            "Authorization",
            `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
          )
          .then((res) => {
            console.log(res);
            this.setState({
              productDetails: res.body.payload,
              detailsReady: true,
            });
          });
      }
    };

    let createReport = () => {
      this.setState({
        showMore: false,
        showReport: true,
      });
    };

    let sendReportData = async (e) => {
      e.preventDefault();
      if (
        this.state.serviceType === "" ||
        this.state.serviceType === "default"
      ) {
        this.setState({
          isAlert: true,
          alertMessage: "Please select a valid service type",
          alertType: "danger",
        });
      } else {
        superagent
          .post(
            "http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq/report/"
          )
          .set(
            "Authorization",
            `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
          )
          .send({
            serviceReqId: this.state.requestId,
            serviceType: this.state.serviceType,
            actionTaken: this.state.actionTaken,
            diagnosisDetails: this.state.diagnosisDetails,
            paid: this.state.paid,
            visitFees: this.state.visitFees,
            repairDetails: this.state.repairDetails,
          })
          .then((res) => {
            this.setState({
              isAlert: true,
              alertMessage: res.body.message,
              alertType: "success",
            });
          });
      }
    };

    const handleCloseReport = () => {
      this.setState({
        showMore: true,
        showReport: false,
      });
    };

    return (
      <>
        <Container className="mt-3 p-2 px-4 text-secondary" fluid>
          {/* More regarding request modal */}
          <Modal
            show={this.state.showMore}
            className="text-secondary"
            onHide={handleClose}
          >
            <Modal.Header>
              <Modal.Title>
                Request ID: {this.state.requestData.requestId}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table>
                <tr>
                  <td>Issue Description</td>
                  <td>{this.state.requestData.description}</td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>{this.state.requestData.status}</td>
                </tr>
                <tr>
                  <td>Raised On</td>
                  <td>
                    {new Date(
                      this.state.requestData.requestDate
                    ).toDateString()}
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <button
                      className="btn btn-block btn-outline-primary"
                      onClick={fetchProductDetails}
                    >
                      {this.state.detailsReady
                        ? `Hide details`
                        : `Get Details about Product IDed ${this.state.requestData.productId}`}
                    </button>
                  </td>
                </tr>
                {this.state.detailsReady ? (
                  <>
                    <tr>
                      <td>Product Name</td>
                      <td>{this.state.productDetails.name}</td>
                    </tr>
                    <tr>
                      <td>Product Model</td>
                      <td>{this.state.productDetails.model}</td>
                    </tr>
                    <tr>
                      <td>Created On</td>
                      <td>
                        {new Date(
                          this.state.productDetails.createdDate
                        ).toDateString()}
                      </td>
                    </tr>
                  </>
                ) : (
                  <></>
                )}
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Close
              </Button>
              {this.state.requestData.status === "Resolved" ? (
                <></>
              ) : this.state.productDetails.length !== 0 ? (
                this.state.productDetails.createdBy ===
                this.state.currentUser ? (
                  <Button variant="outline-primary" onClick={createReport}>
                    Create Report
                  </Button>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </Modal.Footer>
          </Modal>
          {/* Create Report modal */}
          <Modal
            show={this.state.showReport}
            className="text-secondary"
            onHide={handleCloseReport}
          >
            {this.state.isAlert ? (
              <Alert key={this.state.alertType} variant={this.state.alertType}>
                {this.state.alertMessage}
              </Alert>
            ) : (
              <></>
            )}
            <Modal.Header>
              <Modal.Title>Service Request Report</Modal.Title>
            </Modal.Header>
            <Form onSubmit={sendReportData}>
              <Modal.Body>
                <div class="form-group">
                  <label for="serviceType">Choose a sevice type</label>
                  <select
                    className="form-control"
                    id="serviceType"
                    onChange={(e) => {
                      this.setState({
                        serviceType: e.target.value,
                      });
                    }}
                    required
                  >
                    <option value="default">Select an option</option>
                    <option value="GENERAL">General</option>
                    <option value="REPAIR">Repair</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </div>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="actionTaken">
                      <Form.Label>Action Taken</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Action Taken"
                        onChange={(e) => {
                          this.setState({
                            actionTaken: e.target.value,
                          });
                        }}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="visitFees">
                      <Form.Label>Visit Fees</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Visit Fees"
                        onChange={(e) => {
                          this.setState({
                            visitFees: e.target.value,
                          });
                        }}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="diagnosisDetails">
                  <Form.Label>Diagnosis Details</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Diagnosis Details"
                    onChange={(e) => {
                      this.setState({
                        diagnosisDetails: e.target.value,
                      });
                    }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="repairDetails">
                  <Form.Label>Repair Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Repair Details"
                    onChange={(e) => {
                      this.setState({
                        repairDetails: e.target.value,
                      });
                    }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="isPaid">
                  <Form.Check
                    type="checkbox"
                    label="Is the order paid"
                    onChange={(e) => {
                      this.setState({
                        paid: e.target.checked,
                      });
                    }}
                    required
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleCloseReport}>
                  Close
                </Button>
                <Button variant="outline-primary" type="submit">
                  Create Report
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          <Row>
            <Col>
              <h2>Services</h2>
            </Col>
            <div className="col-md-3">
              <Form onSubmit={searchByUser}>
                <div className="input-group rounded">
                  <input
                    type="search"
                    className="form-control rounded"
                    placeholder="Search request by user id"
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={(e) => {
                      this.setState({
                        searchFor: e.target.value,
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
          {this.state.searchByUserData.length > 0 &&
          this.state.searchFor !== "" ? (
            this.state.searchByUserData.map((item, key) => (
              <Card key={key} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col>
                      <Card.Title>Request ID: {item.id}</Card.Title>
                      <Card.Subtitle>
                        Problem: {item.problem} <br />
                        Dated: {new Date(item.requestDate).toDateString()}
                      </Card.Subtitle>
                    </Col>
                    <div className="col-md-1 col-2">
                      <button
                        className="btn btn-md-block btn-outline-danger"
                        onClick={() => {
                          this.setState({
                            requestData: item,
                            showMore: true,
                          });
                        }}
                      >
                        <i className="fa-solid fa-circle-info"></i>
                      </button>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <>
              <hr />
              <MyProductRequest />
            </>
          )}
        </Container>
      </>
    );
  }
}

export default ServiceAdmin;
