import { Component } from "react";
import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import AllReports from "./AllReports";
import MyProductServices from "./MyProductServices";

class MyServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: "default",
      isServices: false,
      isReport: false,
      isAlert: false,
      alertMessage: "",
      alertType: "",
    };
  }

  render() {
    let next = (e) => {
      e.preventDefault();
      if (this.state.option === "Requests") {
        this.setState({
          isServices: true,
          isReport: false,
        });
      } else if (this.state.option === "Reports") {
        this.setState({
          isServices: false,
          isReport: true,
        });
      } else {
        this.setState({
          isAlert: true,
          alertMessage: "Please select an option",
          alertType: "danger",
        });
      }
    };
    return (
      <>
        {this.state.isReport || this.state.isServices ? (
          this.state.isReport ? (
            <Container fluid>
              <AllReports />
            </Container>
          ) : (
            <Container fluid>
              <MyProductServices />
            </Container>
          )
        ) : (
          <Container fluid>
            {this.state.isAlert ? (
              <Alert key={this.state.alertType} variant={this.state.alertType}>
                {this.state.alertMessage}
              </Alert>
            ) : (
              <></>
            )}
            <Form onSubmit={next}>
              <div className="form-group">
                <label htmlFor="option">Please select an option</label>
                <select
                  className="form-control"
                  id="option"
                  onChange={(e) => {
                    this.setState({
                      option: e.target.value,
                    });
                  }}
                  required
                >
                  <option value="default">Select an option</option>
                  <option value="Requests">All Requests</option>
                  <option value="Reports">All Reports</option>
                </select>
              </div>
              <Row>
                <Col></Col>
                <div className="col-md-2 d-flex justify-content-end">
                  <button
                    className="btn btn-block btn-outline-danger"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </Row>
            </Form>
          </Container>
        )}
      </>
    );
  }
}

export default MyServices;
