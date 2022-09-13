import { AESDecrypt } from "cookie-cryptr";
import { useState } from "react";
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
import Cookies from "universal-cookie";
import superagent from "superagent";

export default function SignleProduct(props) {
  const [isAlert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [problem, setProblem] = useState("");
  const [description, setDescription] = useState("");
  const [showServiceRequestModal, setShowServiceRequestModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const cookies = new Cookies();

  let handleServiceRequestClose = () => {
    setAlert(false);
    setShowServiceRequestModal(false);
  };

  let handleUpdateClose = () => {
    setAlert(false);
    setShowUpdateModal(false);
  };

  let handleDeleteClose = () => {
    setAlert(false);
    setShowDeleteModal(false);
  };

  let serviceRequest = async (e) => {
    e.preventDefault();
    superagent
      .post("http://sbm-service.us-west-2.elasticbeanstalk.com/servicereq")
      .set(
        "Authorization",
        `Bearer ${AESDecrypt(cookies.get("token"), "test")}`
      )
      .send({
        productId: productDetails.id,
        problem: problem,
        description: description,
      })
      .then((res) => {
        setAlert(true);
        setAlertType("success");
        setAlertMessage(res.body.message);
        setShowServiceRequestModal(true);
      })
      .catch(console.error);
  };

  let updateItem = async (e) => {
    e.preventDefault();
    superagent
      .put(
        `http://sbm-products.us-west-2.elasticbeanstalk.com/product/${productDetails.id}`
      )
      .set(
        "Authorization",
        `Bearer ${AESDecrypt(cookies.get("token"), "test")}`
      )
      .send({
        name: productDetails.name,
        make: productDetails.make,
        model: productDetails.model,
        cost: productDetails.cost,
        productImageUrl: productDetails.productImageUrl,
      })
      .then((res) => {
        setAlert(true);
        setAlertType("success");
        setAlertMessage(res.body.message);
        setShowServiceRequestModal(false);
      })
      .catch(console.error);
  };

  let deleteItem = async () => {
    superagent
      .delete(
        `http://sbm-products.us-west-2.elasticbeanstalk.com/product/${productDetails.id}`
      )
      .set(
        "Authorization",
        `Bearer ${AESDecrypt(cookies.get("token"), "test")}`
      )
      .then((res) => {
        setAlert(true);
        setAlertType("success");
        setAlertMessage(res.body.message);
      })
      .catch(console.error);
  };

  return (
    <Container>
      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={handleUpdateClose}>
        {isAlert ? (
          <Alert className="mb-1" key={alertType} variant={alertType}>
            {alertMessage}
          </Alert>
        ) : (
          <></>
        )}
        <Modal.Header>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={updateItem}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={productDetails.name}
                placeholder="Enter product name"
                onChange={(e) => {
                  setProductDetails({
                    ...productDetails,
                    name: e.target.value,
                  });
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
                    value={productDetails.make}
                    onChange={(e) => {
                      setProductDetails({
                        ...productDetails,
                        make: e.target.value,
                      });
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
                    value={productDetails.model}
                    onChange={(e) => {
                      setProductDetails({
                        ...productDetails,
                        model: e.target.value,
                      });
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
                value={productDetails.cost}
                onChange={(e) => {
                  setProductDetails({
                    ...productDetails,
                    cost: e.target.value,
                  });
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productImageUrl">
              <Form.Label>Image Url</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product's image"
                value={productDetails.productImageUrl}
                onChange={(e) => {
                  setProductDetails({
                    ...productDetails,
                    productImageUrl: e.target.value,
                  });
                }}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleUpdateClose}>
              Nope
            </Button>
            <Button variant="outline-primary" onClick={updateItem}>
              Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Request Services Modal */}
      <Modal show={showServiceRequestModal} onHide={handleServiceRequestClose}>
        {isAlert ? (
          <Alert className="mb-1" key={alertType} variant={alertType}>
            {alertMessage}
          </Alert>
        ) : (
          <></>
        )}
        <Modal.Header>
          <Modal.Title>
            Request Service for {productDetails.name} {productDetails.model}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={serviceRequest}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="problem">
              <Form.Label>Enter your problem</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the problem with your device"
                onChange={(e) => {
                  setProblem(e.target.value);
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter problem's description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              type="reset"
              onClick={handleServiceRequestClose}
            >
              Close
            </Button>
            <Button
              variant="outline-primary"
              type="submit"
              onClick={serviceRequest}
            >
              Raise Request
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteClose}>
        {isAlert ? (
          <Alert className="mb-1" key={alertType} variant={alertType}>
            {alertMessage}
          </Alert>
        ) : (
          <></>
        )}
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product with id:{" "}
          {productDetails.id}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleDeleteClose}>
            No, thanks
          </Button>
          <Button variant="outline-danger" onClick={deleteItem}>
            Yes, delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Card>
        <Card.Body>
          <Row>
            <div className="col-md-2">
              <Image src={props.data.productImageUrl} fluid />
            </div>
            <Col>
              <Card.Title>{props.data.name}</Card.Title>
              <Card.Subtitle>Created By: {props.data.createdBy}</Card.Subtitle>
              <Card.Text>
                {new Date(props.data.createdDate).toDateString()}
              </Card.Text>
            </Col>
            <div className="col-md-4 mt-md-0 mt-2">
              <Row>
                {props.currentUser === props.data.createdBy ||
                props.currentUserRole === "ROLE_ADMIN" ? (
                  <>
                    <button
                      className="col btn btn-outline-primary m-1"
                      onClick={() => {
                        setProductDetails(props.data);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="col btn btn-outline-danger m-1"
                      onClick={() => {
                        setProductDetails(props.data);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-block btn-outline-primary"
                    onClick={() => {
                      setShowServiceRequestModal(true);
                      setProductDetails(props.data);
                    }}
                  >
                    Request
                  </button>
                )}
              </Row>
            </div>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
