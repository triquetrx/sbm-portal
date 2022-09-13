import { AESDecrypt } from "cookie-cryptr";
import { Component } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import superagent from "superagent";
import Cookies from "universal-cookie";

class AllReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {},
      cookies: new Cookies(),
      openReport: false,
      reportData: {},
      searchByUserData: {},
      searchFor: "",
    };
  }

  componentDidMount() {
    if (this.state.cookies.get("token")) {
      superagent
        .get(
          "http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq/report/"
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          this.setState({
            result: res.body.payload,
          });
        })
        .catch(console.error);
    }
  }

  render() {
    const handleClose = () => this.setState({ openReport: false });

    let searchByUser = (e) => {
      e.preventDefault();
      superagent
        .get(
          `http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq/report/userId/${this.state.searchFor}`
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          this.setState({
            searchByUserData: res.body.payload,
          });
        })
        .catch(console.error);
    };

    return (
      <>
        <Row>
          <Col>
            <h3 className="mb-3">All Reports</h3>
          </Col>
          <div className="col-md-3">
            <Form onSubmit={searchByUser}>
              <div className="input-group rounded">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Search by user"
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
        <hr />
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
        {this.state.searchByUserData > 0 ? (
          this.state.searchByUserData.map((item, key) => (
            <Card className="mb-3" key={key}>
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>Report ID: {item.id}</Card.Title>
                    <Card.Subtitle>
                      Request ID: {item.serviceReqId} <br />
                      Dated: {new Date(item.reportDate).toDateString()}
                    </Card.Subtitle>
                  </Col>
                  <div className="col-md-1 col-2">
                    <button
                      className="btn btn-md-block btn-outline-danger"
                      onClick={() => {
                        this.setState({
                          reportData: item,
                          openReport: true,
                        });
                      }}
                    >
                      <i className="fa-regular fa-envelope"></i>
                    </button>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : (
          <>
            {this.state.result !== null ? (
              this.state.result.length > 0 ? (
                this.state.result.map((item, key) => (
                  <Card className="mb-3" key={key}>
                    <Card.Body>
                      <Row>
                        <Col>
                          <Card.Title>Report ID: {item.id}</Card.Title>
                          <Card.Subtitle>
                            Request ID: {item.serviceReqId} <br />
                            Dated: {new Date(item.reportDate).toDateString()}
                          </Card.Subtitle>
                        </Col>
                        <div className="col-md-1 col-2">
                          <button
                            className="btn btn-md-block btn-outline-danger"
                            onClick={() => {
                              this.setState({
                                reportData: item,
                                openReport: true,
                              });
                            }}
                          >
                            <i className="fa-regular fa-envelope"></i>
                          </button>
                        </div>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <></>
              )
            ) : (
              <Container fluid>
                <h6>No Data Found</h6>
              </Container>
            )}
          </>
        )}
      </>
    );
  }
}

export default AllReports;
