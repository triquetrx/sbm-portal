import { Component } from "react";
import Cookies from "universal-cookie";
import superagent from "superagent";
import { AESDecrypt } from "cookie-cryptr";
import {
  Card,
  Col,
  Row,
  Modal,
  Button,
  Table,
  Form,
  Alert,
} from "react-bootstrap";

class MyProductRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      result: {},
      showMore: false,
      userEmail: "",
      user: {},
      productId: "",
      productDetails: {},
      detailsReady: false,
      showGenerateReport: false,
      requestId: "",
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
      reportData: {},
      start: 0,
      end: 10,
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
          console.log(res);
          this.setState({
            userEmail: res.body.email,
          });
        })
        .catch((err) => {
          console.error(err.response.body);
        });
      superagent
        .get("http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq")
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          console.log(res);
          this.setState({
            result: res.body.payload,
          });
        })
        .catch(console.error);
    }
  }

  render() {
    const handleClose = () => {
      this.setState({
        showMore: false,
        showGenerateReport: false,
        openReport: false,
        productDetails: {},
        detailsReady: false,
      });
    };

    const handleCloseReport = () => {
      this.setState({
        showMore: true,
        showGenerateReport: false,
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
            `http://sbm-products.us-west-2.elasticbeanstalk.com/product/${this.state.productId}`
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
        showGenerateReport: true,
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

    let showLess = () => {
      this.setState({
        start: this.state.start - 10,
        end: this.state.end - 10,
      });
    };
    let showMore = () => {
      this.setState({
        start: this.state.start + 10,
        end: this.state.end + 10,
      });
    };

    return (
      <div className="mt-4">
        {/* More regarding request modal */}
        <Modal
          show={this.state.showMore}
          className="text-secondary"
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title>Request ID: {this.state.requestId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table>
              <tr>
                <td>Request Raised By</td>
                <td>{this.state.user.name}</td>
              </tr>
              <tr>
                <td>Email ID:</td>
                <td>{this.state.user.email}</td>
              </tr>
              <tr>
                <td>Contact Number</td>
                <td>{this.state.user.mobile}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button
                    className="btn btn-block btn-outline-primary"
                    onClick={fetchProductDetails}
                  >
                    {this.state.detailsReady
                      ? `Hide details`
                      : `Get Details about Product IDed ${this.state.productId}`}
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
            {this.state.productDetails.createdBy === this.state.userEmail ? (
              <Button variant="outline-primary" onClick={createReport}>
                Create Report
              </Button>
            ) : (
              <></>
            )}
          </Modal.Footer>
        </Modal>

        {/* Service Request Report */}
        <Modal
          show={this.state.showGenerateReport}
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
              <div className="form-group">
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

        {/* Report Data Model */}
        <Modal show={this.state.openReport} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped>
              <tbody>
                <tr>
                  <td>Report ID</td>
                  <td>{this.state.reportData.id}</td>
                </tr>
                <tr>
                  <td>Action Taken</td>
                  <td>{this.state.reportData.actionTaken}</td>
                </tr>
                <tr>
                  <td>Diagnosis Details</td>
                  <td>{this.state.reportData.diagnosisDetails}</td>
                </tr>
                <tr>
                  <td>Report Date</td>
                  <td>
                    {new Date(this.state.reportData.reportDate).toDateString()}
                  </td>
                </tr>
                <tr>
                  <td>Paid</td>
                  <td>{this.state.reportData.paid ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Service Type</td>
                  <td>{this.state.reportData.serviceType}</td>
                </tr>
                <tr>
                  <td>Visit Fees</td>
                  <td>
                    <b>₹ {this.state.reportData.visitFees}</b>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {this.state.result.length > 0 ? (
          <>
            <Row>
              <Col>
                <h3 className="text-secondary pb-3">All Requests</h3>
              </Col>
              <div className="col-2 col-md-1">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    this.setState({
                      isFilterStatus: !this.state.isFilterStatus,
                    });
                  }}
                >
                  <i className="fa-solid fa-filter"></i>
                </button>
              </div>
            </Row>
            {this.state.result
              // .slice(this.state.start, this.state.end)
              .map((item, key) =>
                this.state.isFilterStatus ? (
                  item.status === "Pending" ? (
                    <Card key={key} className="mb-3">
                      <Card.Body>
                        <Row>
                          <Col>
                            <Card.Title>Request Id: {item.id}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {new Date(item.requestDate).toDateString()} |
                              Product ID: {item.productId}
                            </Card.Subtitle>
                            <Card.Text>{item.description}</Card.Text>
                          </Col>
                          <div className="col-3 col-md-2">
                            <button
                              className="btn btn-outline-danger ml-md-1"
                              onClick={() => {
                                this.setState({
                                  showMore: true,
                                  user: item.user,
                                  requestId: item.id,
                                  productId: item.productId,
                                });
                              }}
                            >
                              More
                            </button>
                          </div>
                          <div className="col-2 col-md-1">
                            {item.status === "Pending" ? (
                              <i className="fa-regular fa-clock text-warning"></i>
                            ) : (
                              <>
                                <i className="fa-regular fa-circle-check text-success"></i>
                              </>
                            )}
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  ) : (
                    <></>
                  )
                ) : (
                  <>
                    <Card key={key} className="mb-3">
                      <Card.Body>
                        <Row>
                          <Col>
                            <Card.Title>Request Id: {item.id}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {new Date(item.requestDate).toDateString()} |
                              Product ID: {item.productId}
                            </Card.Subtitle>
                            <Card.Text>{item.description}</Card.Text>
                          </Col>
                          <div className="col-2 col-md-1">
                            {item.status === "Pending" ? (
                              <button
                                className="btn btn-outline-danger ml-md-1"
                                onClick={() => {
                                  this.setState({
                                    showMore: true,
                                    user: item.user,
                                    requestId: item.id,
                                    productId: item.productId,
                                  });
                                }}
                              >
                                <i className="fa-solid fa-circle-info"></i>
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-primary ml-md-1"
                                onClick={() => {
                                  superagent
                                    .get(
                                      `http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq/report/requestId/${item.id}`
                                    )
                                    .set(
                                      "Authorization",
                                      `Bearer ${AESDecrypt(
                                        this.state.cookies.get("token"),
                                        "test"
                                      )}`
                                    )
                                    .then((res) => {
                                      this.setState({
                                        openReport: true,
                                        reportData: res.body.payload,
                                      });
                                    })
                                    .catch(console.error);
                                }}
                              >
                                <i className="fa-solid fa-file-invoice"></i>
                              </button>
                            )}
                          </div>
                          <div className="col-2 col-md-1">
                            {item.status === "Pending" ? (
                              <i className="fa-regular fa-clock text-warning"></i>
                            ) : (
                              <>
                                <i className="fa-regular fa-circle-check text-success"></i>
                              </>
                            )}
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  </>
                )
              )}
            {this.state.result.length > this.state.end ? (
              <div className="d-flex justify-content-end my-4 text-end">
                {this.state.start > 10 ? (
                  <button
                    className="text-danger mx-1"
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    onClick={showLess}
                  >
                    Less
                  </button>
                ) : (
                  <></>
                )}
                <button
                  className="text-primary mx-1"
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                  }}
                  onClick={showMore}
                >
                  More
                </button>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <h4>No Requests available yet</h4>
        )}
      </div>
    );
  }
}

export default MyProductRequest;
