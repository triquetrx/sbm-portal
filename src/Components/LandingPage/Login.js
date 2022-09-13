import { useState } from "react";
import { Alert, Col, Container, Form, Image, Row } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import Bottom from "./Bottom";
import TopBarLandingPage from "./TopBarLandingPage";
import superagent from "superagent";
import Cookies from "universal-cookie";
import { AESEncrypt } from "cookie-cryptr";
import LoadingPage from "../LoadingPage";

export default function Login(props) {
  const [userData, setUserData] = useState({});
  const [isAlert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isLoader, setLoader] = useState(false);
  const cookies = new Cookies();

  let loginUser = async (e) => {
    e.preventDefault();
    setLoader(true);
    superagent
      .post(
        "http://sbmusermanagement-env.eba-h2s2jmtn.us-west-2.elasticbeanstalk.com/user/login"
      )
      .send({
        email: userData.email,
        password: userData.password,
      })
      .then((res) => {
        cookies.set("token", AESEncrypt(res.body.payload.token, "test"), {
          path: "/",
          expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
          secure: true,
          sameSite: true,
        });
        cookies.set("name", AESEncrypt(res.body.payload.name, "test"), {
          path: "/",
          expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
          secure: true,
          sameSite: true,
        });
        setLoader(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        setAlert(true);
        setAlertMessage(err.response.body.message);
        setAlertType("danger");
        setLoader(false);
      });
  };

  let clear = () => {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  };

  return (
    <>
      {cookies.get("token") ? (
        <Navigate to="/dashboard" />
      ) : (
        <>
          {isLoader ? <LoadingPage /> : <></>}
          <TopBarLandingPage />
          <Container className="mt-5 pt-2 mb-3 text-secondary">
            <Row>
              <div className="col-md">
                <Image src={require("../../Images/login-page.png")} fluid />
              </div>
              <Col className="col-md-6 text-md-left mt-md-4">
                {isAlert ? (
                  <Alert key={alertType} variant={alertType}>
                    {alertMessage}
                  </Alert>
                ) : (
                  <></>
                )}
                <h2 className="mb-3 mt-5">Login Page</h2>
                <Form className="mt-4" onSubmit={loginUser}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                      required
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Col>
                      <Link to="/signup">Create new account</Link>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <Link className="text-danger" to="/forgot-password">
                        Forgot password?
                      </Link>
                    </Col>
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
              </Col>
            </Row>
          </Container>
          <Bottom />
        </>
      )}
    </>
  );
}
