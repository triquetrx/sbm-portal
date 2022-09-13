import { Component } from "react";
import Cookies from "universal-cookie";
import superagent from "superagent";
import { AESDecrypt } from "cookie-cryptr";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

class MyRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      result: {},
      isFilterStatus: false,
      openReport: false,
      reportData: {},
      isAlert: false,
      alertType: "",
      alertMessage: "",
      editData: {},
      description: "",
      problem: "",
      showServiceRequestModal: false,
      showDelete: false,
      deleteId: "",
    };
  }

  componentDidMount() {
    if (this.state.cookies.get("token")) {
      superagent
        .get(
          "http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq/my-requests"
        )
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
    const handleClose = () =>
      this.setState({ openReport: false, isAlert: false });

    let handleServiceRequestClose = () => {
      this.setState({ showServiceRequestModal: false, isAlert: false });
    };

    let serviceRequest = async (e) => {
      e.preventDefault();
      superagent
        .put(
          `http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq/${this.state.editData.id}`
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .send({
          productId: this.state.editData.productId,
          problem: this.state.editData.problem,
          description: this.state.editData.description,
        })
        .then((res) => {
          console.log(res);
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: res.body.message,
            showServiceRequestModal: true,
          });
        })
        .catch(console.error);
    };

    let handleDeleteClose = () => {
      this.setState({ showDelete: false, isAlert: false });
    };

    let deleteItem = async () => {
      superagent
        .delete(
          `http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq/${this.state.deleteId}`
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          console.log(res);
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: res.body.message,
            showDelete: true,
          });
        })
        .catch(console.error);
    };

    return (
      <div className="mt-4">
        {/* Request Services update Modal */}
        <Modal
          show={this.state.showServiceRequestModal}
          onHide={handleServiceRequestClose}
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
            <Modal.Title>
              Update Request IDed {this.state.editData.id}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={serviceRequest}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="problem">
                <Form.Label>Enter your problem</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the problem with your device"
                  value={this.state.problem}
                  onChange={(e) => {
                    this.setState({
                      problem: e.target.value,
                    });
                  }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter problem's description"
                  value={this.state.description}
                  onChange={(e) => {
                    this.setState({
                      description: e.target.value,
                    });
                  }}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleServiceRequestClose}>
                Close
              </Button>
              <Button variant="outline-primary" onClick={serviceRequest}>
                Update Request
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Delete request modal */}
        <Modal show={this.state.showDelete} onHide={handleDeleteClose}>
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
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Request with id {this.state.deleteId} will be deleted
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              No, thanks
            </Button>
            <Button variant="outline-danger" onClick={deleteItem}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {this.state.result.length > 0 ? (
          <>
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
                        {new Date(
                          this.state.reportData.reportDate
                        ).toDateString()}
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
            <Row>
              <Col>
                <h3 className="mb-3">Requests raised</h3>
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
            {this.state.result.map((item, key) =>
              this.state.isFilterStatus ? (
                item.status === "Resolved" ? (
                  <Card key={key} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col>
                          <Card.Title>Request Id: {item.id}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            {new Date(item.requestDate).toDateString()}
                          </Card.Subtitle>
                          <Card.Text>{item.description}</Card.Text>
                        </Col>
                        <div className="col-1">
                          {item.status === "Pending" ? (
                            <></>
                          ) : (
                            <button
                              className="btn btn-block btn-outline-primary"
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
                                    console.log(res);
                                    this.setState({
                                      openReport: true,
                                      reportData: res.body.payload,
                                    });
                                  })
                                  .catch(console.error);
                              }}
                            >
                              <i className="fa-regular fa-envelope"></i>
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
                ) : (
                  <></>
                )
              ) : (
                <Card key={key} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col>
                        <Card.Title>Request Id: {item.id}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {new Date(item.requestDate).toDateString()}
                        </Card.Subtitle>
                        <Card.Text>{item.description}</Card.Text>
                      </Col>

                      <div className="col-2 col-md-1">
                        {item.status === "Pending" ? (
                          <i className="fa-regular fa-clock text-warning"></i>
                        ) : (
                          <>
                            <i className="fa-regular fa-circle-check text-success"></i>
                          </>
                        )}
                      </div>
                      {item.status === "Pending" ? (
                        <>
                          <div className="col-md-1 my-md-0 my-2 ">
                            <button
                              className="btn btn-outline-primary btn-block"
                              onClick={(e) => {
                                this.setState({
                                  showServiceRequestModal: true,
                                  editData: item,
                                  description: item.description,
                                  problem: item.problem,
                                });
                              }}
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                          </div>
                          <div className="col-md-1">
                            <button
                              className="btn btn-outline-danger btn-block"
                              onClick={() =>
                                this.setState({
                                  showDelete: true,
                                  deleteId: item.id,
                                })
                              }
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {item.status === "Pending" ? (
                        <></>
                      ) : (
                        <div className="col-md-1 mt-2 mt-md-0">
                          <button
                            className="btn btn-block btn-outline-primary"
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
                                  console.log(res);
                                  this.setState({
                                    openReport: true,
                                    reportData: res.body.payload,
                                  });
                                })
                                .catch(console.error);
                            }}
                          >
                            <i className="fa-regular fa-envelope"></i>
                          </button>
                        </div>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              )
            )}
          </>
        ) : (
          <h4>No Requests Raised yet</h4>
        )}
      </div>
    );
  }
}

export default MyRequest;
