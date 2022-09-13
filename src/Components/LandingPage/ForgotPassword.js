import { useState } from "react";
import { Alert, Col, Container, Form, Image, Row } from "react-bootstrap";
import Bottom from "./Bottom";
import TopBarLandingPage from "./TopBarLandingPage";
import superagent from "superagent";

export default function ForgotPassword(props) {
  const [userData, setUserData] = useState({});
  const [isAlert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  let forgotPassword = async (e) => {
    e.preventDefault();
    if (userData.confirmPassword.match(userData.newPassword)) {
      setAlert(false);
      superagent
        .put(
          " http://sbmauthapp-env.eba-9pddynji.us-west-2.elasticbeanstalk.com/forgot-password"
        )
        .send({
          email: userData.email,
          securityKey: userData.securityKey,
          newPassword: userData.newPassword,
        })
        .then((res) => {
          setAlert(true);
          setAlertType("success");
          setAlertMessage(res.text);
        })
        .catch((err) => {
          console.error(err);
          setAlert(true);
          setAlertType("danger");
          setAlertMessage(err.response.text);
        });
    } else {
      setAlert(true);
      setAlertType("danger");
      setAlertMessage("Confirm password and password not a match");
    }
  };

  let clear = () => {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("securityKey").value = "";
    document.getElementById("confirmPassword").value = "";
  };

  return (
    <>
      <TopBarLandingPage />
      <Container className="mt-3 mb-3 text-secondary">
        <Row>
          <Col className="mt-5 mt-md-4">
            <Image src={require("../../Images/forgot-password.png")} fluid />
          </Col>
          <div className="col-md-6 mt-md-3 pt-md-5 pb-3 pb-md-0 text-center text-md-left">
            {isAlert ? (
              <Alert className="mb-1" key={alertType} variant={alertType}>
                {alertMessage}
              </Alert>
            ) : (
              <></>
            )}
            <h2 className="mt-md-3 mb-3">Forgot Password</h2>
            <Form onSubmit={forgotPassword}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="securityKey">
                <Form.Label>Security Key</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Security key"
                  onChange={(e) =>
                    setUserData({ ...userData, securityKey: e.target.value })
                  }
                  required
                />
                <Form.Text className="text-muted">
                  Key is DateOfAccountOpening+EmailId+BirthDate
                  <br />
                  Note: No spaces and date must be in form dd-MM-yyyy
                </Form.Text>
              </Form.Group>
              <Row>
                <div className="col-md">
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md">
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </div>
              </Row>
              <Row>
                <Col>
                  <button
                    className="btn btn-outline-primary btn-block"
                    type="submit"
                  >
                    Submit
                  </button>
                </Col>
                <Col>
                  <button
                    type="reset"
                    onClick={clear}
                    className="btn btn-danger btn-block"
                  >
                    Clear
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
        </Row>
      </Container>
      <Bottom />
    </>
  );
}
