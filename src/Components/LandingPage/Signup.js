import { useState } from "react";
import { Alert, Col, Container, Form, Image, Row } from "react-bootstrap";
import Bottom from "./Bottom";
import TopBarLandingPage from "./TopBarLandingPage";
import superagent from "superagent";
import { Link } from "react-router-dom";

export default function Signup(second) {
  const [userData, setUserData] = useState({});
  const [isAlert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  let registerUser = async (e) => {
    e.preventDefault();
    if (userData.gender === "default" || userData.gender === "") {
      setAlert("true");
      setAlertType("danger");
      setAlertMessage("Please select your gender");
    } else {
      superagent
        .post(
          "http://sbmusermanagement-env.eba-h2s2jmtn.us-west-2.elasticbeanstalk.com/user"
        )
        .send({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          mobile: userData.mobile,
          gender: userData.gender,
          birthDate: userData.birthDate,
        })
        .then((res) => {
          setAlertMessage(res.body.message);
          setAlert("true");
          setAlertType("success");
          document.getElementById("name").value = "";
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";
          document.getElementById("birthDate").value = "";
          document.getElementById("mobile").value = "";
          document.getElementById("gender").value = "default";
        })
        .catch((err) => {
          console.error(err);
          setAlert("true");
          setAlertType("danger");
          setAlertMessage(err.response.body.message);
        });
    }
  };

  let clear = () => {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("birthDate").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("gender").value = "default";
  };

  return (
    <>
      <TopBarLandingPage />
      <Container className="mt-5 pt-5 mb-3 text-secondary">
        <Row>
          <div className="d-block d-md-none">
            <Image src={require("../../Images/signup-page.png")} fluid />
          </div>
          <Col className="col-md-7 text-md-left mt-md-4">
            {isAlert ? (
              <Alert key={alertType} variant={alertType}>
                {alertMessage}
              </Alert>
            ) : (
              <></>
            )}
            <h2 className="mb-3">Create new Account</h2>
            <Form onSubmit={registerUser}>
              <Row>
                <div className="col-md">
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md">
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </div>
              </Row>

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
              <Row>
                <div className="col-md">
                  <Form.Group className="mb-3" controlId="birthDate">
                    <Form.Label>Birth Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Enter your birth date"
                      onChange={(e) =>
                        setUserData({ ...userData, birthDate: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md">
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setUserData({ ...userData, gender: e.target.value })
                      }
                      id="gender"
                      required
                    >
                      <option value="default">Select your gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </Row>
              <Form.Group className="mb-3" controlId="mobile">
                <Form.Label>Enter your mobile number</Form.Label>
                <Form.Control
                  type="number"
                  minLength={10}
                  placeholder="Enter your mobile number"
                  onChange={(e) =>
                    setUserData({ ...userData, mobile: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Link
                className="text-danger d-flex justify-content-end"
                to="/login"
              >
                Already have an account?
              </Link>
              <Row>
                <Col>
                  <button
                    type="submit"
                    className="btn btn-outline-primary mt-3 btn-block"
                  >
                    Submit
                  </button>
                </Col>
                <Col>
                  <button
                    type="reset"
                    className="btn btn-danger mt-3 btn-block"
                    onClick={clear}
                  >
                    Clear
                  </button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col className="d-none d-md-block">
            <Image src={require("../../Images/signup-page.png")} fluid />
          </Col>
        </Row>
      </Container>
      <Bottom />
    </>
  );
}
