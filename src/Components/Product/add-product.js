import { useState } from "react";
import { Alert, Container, Form, Image, Row } from "react-bootstrap";
import Bottom from "../LandingPage/Bottom";
import TopBar from "../TopBar/TopBar";
import superagent from "superagent";
import { AESDecrypt } from "cookie-cryptr";
import Cookies from "universal-cookie";

export default function AddProduct(props) {
  const [userData, setUserData] = useState({});
  const [isAlert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const cookies = new Cookies();

  let uploadProduct = async (e) => {
    e.preventDefault();
    superagent
      .post("http://sbm-products.us-west-2.elasticbeanstalk.com/product")
      .set(
        "Authorization",
        `Bearer ${AESDecrypt(cookies.get("token"), "test")}`
      )
      .send({
        name: userData.name,
        make: userData.make,
        model: userData.model,
        cost: userData.cost,
        productImageUrl: userData.productImageUrl,
      })
      .then((res) => {
        setAlert(true);
        setAlertMessage(res.body.message);
        setAlertType("success");
        clear();
      })
      .catch((err) => {
        console.error(err);
        setAlert(true);
        setAlertMessage(err.response.body.message);
        setAlertType("danger");
      });
  };

  let clear = () => {
    document.getElementById("name").value = "";
    document.getElementById("make").value = "";
    document.getElementById("model").value = "";
    document.getElementById("cost").value = "";
    document.getElementById("productImageUrl").value = "";
  };

  return (
    <>
      <TopBar />
      <Container fluid className="mt-4 py-2 px-5 text-secondary">
        <Row>
          <div className="col-md-5">
            <Image src={require("../../Images/add-product.png")} fluid />
          </div>
          <div className="col-md">
            {isAlert ? (
              <Alert key={alertType} variant={alertType}>
                {alertMessage}
              </Alert>
            ) : (
              <></>
            )}
            <h2>Add New Product</h2>
            <Form className="mt-3 mb-3" onSubmit={uploadProduct}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  onChange={(e) => {
                    setUserData({ ...userData, name: e.target.value });
                  }}
                  required
                />
              </Form.Group>
              <Row>
                <div className="col-md">
                  <Form.Group className="mb-3" controlId="make">
                    <Form.Label>Make</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter product's Make"
                      onChange={(e) => {
                        setUserData({ ...userData, make: e.target.value });
                      }}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md">
                  <Form.Group className="mb-3" controlId="model">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter product's model"
                      onChange={(e) => {
                        setUserData({ ...userData, model: e.target.value });
                      }}
                      required
                    />
                  </Form.Group>
                </div>
              </Row>
              <Form.Group className="mb-3" controlId="cost">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter product's cost"
                  onChange={(e) => {
                    setUserData({ ...userData, cost: e.target.value });
                  }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="productImageUrl">
                <Form.Label>Image Url</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product's image"
                  onChange={(e) => {
                    setUserData({
                      ...userData,
                      productImageUrl: e.target.value,
                    });
                  }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="If the product is a duplicate then, I know that it can be removed"
                  required
                />
              </Form.Group>
              <Row>
                <div className="col-md">
                  <button
                    className="btn btn-outline-primary btn-block"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
                <div className="col-md mt-md-0 mt-2">
                  <button
                    className="btn btn-danger btn-block"
                    type="reset"
                    onClick={clear}
                  >
                    Clear
                  </button>
                </div>
              </Row>
            </Form>
          </div>
        </Row>
      </Container>
      <Bottom />
    </>
  );
}
