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
} from "react-bootstrap";
import superagent from "superagent";
import Cookies from "universal-cookie";
import $ from "jquery";

class AllProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      result: {},
      currentUser: "",
      showServiceRequestModal: false,
      showUpdateModal: false,
      productId: "",
      start: 0,
      end: 5,
      isAlert: false,
      alertType: "",
      alertMessage: "",
      name: "",
      make: "",
      model: "",
      cost: "",
      productImageUrl: "",
      problem: "",
      description: "",
      currentUserRole: "",
      showDeleteModal: false,
    };
  }

  componentDidMount() {
    superagent
      .get("http://localhost:8001/validate/")
      .set(
        "Authorization",
        `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
      )
      .then((res) => {
        this.setState({
          currentUser: res.body.email,
          currentUserRole: res.body.userRole,
        });
      })
      .catch((err) => {
        console.error(err);
      });
    superagent
      .get("http://localhost:8003/product/")
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
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    let showLess = () => {
      this.setState({
        start: this.state.start - 5,
        end: this.state.end - 5,
      });
    };
    let showMore = () => {
      this.setState({
        start: this.state.start + 5,
        end: this.state.end + 5,
      });
    };

    $(document).ready(function () {
      $(".card").find(".card-body p").hide();
      $(".card").hover(
        function () {
          $(this).css("margin-bottom", "2rem");
          $(this).find(".card-body p").show(200);
        },
        function () {
          $(this).css("margin-bottom", "0rem");
          $(this).find(".card-body p").hide(200);
        }
      );
    });

    let handleServiceRequestClose = () => {
      this.setState({ showServiceRequestModal: false });
    };
    let handleUpdateClose = () => {
      this.setState({ showUpdateModal: false });
    };

    let serviceRequest = async (e) => {
      e.preventDefault();
      superagent
        .post("http://localhost:8004/servicereq")
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .send({
          productId: this.state.productId,
          problem: this.state.problem,
          description: this.state.description,
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

    let updateItem = async (e) => {
      e.preventDefault();
      superagent
        .put(`http://localhost:8003/product/${this.state.productId}`)
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .send({
          name: this.state.name,
          make: this.state.make,
          model: this.state.model,
          cost: this.state.cost,
          productImageUrl: this.state.productImageUrl,
        })
        .then((res) => {
          console.log(res);
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: res.body.message,
            showServiceRequestModal: false,
          });
        })
        .catch(console.error);
    };

    let deleteItem = async () => {
      superagent
        .delete(`http://localhost:8003/product/${this.state.productId}`)
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          console.log(res.body);
          this.setState({
            isAlert: true,
            alertType: "success",
            alertMessage: res.body.message,
            showDeleteModal: false,
          });
        })
        .catch(console.error);
    };

    let handleDeleteClose = () => {
      this.setState({ showDeleteModal: false });
    };

    return (
      <>
        <Container className="mt-3" fluid>
          {/* Update modal */}
          <Modal show={this.state.showUpdateModal} onHide={handleUpdateClose}>
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
              <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updateItem}>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.name}
                    placeholder="Enter product name"
                    onChange={(e) => {
                      this.setState({
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
                        value={this.state.make}
                        onChange={(e) => {
                          this.setState({
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
                        value={this.state.model}
                        onChange={(e) => {
                          this.setState({
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
                    value={this.state.cost}
                    onChange={(e) => {
                      this.setState({
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
                    value={this.state.productImageUrl}
                    onChange={(e) => {
                      this.setState({
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
                Request Service for {this.state.name} {this.state.model}
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
                  Raise Request
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* Delete Modal */}
          <Modal show={this.state.showDeleteModal} onHide={handleDeleteClose}>
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
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete the product with id:{" "}
              {this.state.productId}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleDeleteClose}>
                Nope
              </Button>
              <Button variant="outline-danger" onClick={deleteItem}>
                Yes, Delete
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Main Code */}
          {this.state.result.length > 0 ? (
            <>
              <Row className="d-flex justify-content-center">
                {this.state.result
                  .slice(this.state.start, this.state.end)
                  .map((item, key) => (
                    <div key={key} className="m-2">
                      <Card style={{ width: "16rem" }}>
                        <Card.Img
                          variant="top"
                          src={item.productImageUrl}
                          height="220"
                        />
                        <Card.Body>
                          <Card.Title className="text-secondary">
                            {item.make}
                            <br />₹ {item.cost}
                          </Card.Title>
                          <Card.Text>{item.name}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          {item.createdBy === this.state.currentUser ||
                          this.state.currentUserRole === "ROLE_ADMIN" ? (
                            <>
                              <Row>
                                <Col>
                                  <button
                                    className="btn btn-block btn-outline-primary"
                                    onClick={() => {
                                      this.setState({
                                        showUpdateModal: true,
                                        productId: item.id,
                                        name: item.name,
                                        make: item.make,
                                        model: item.model,
                                        cost: item.cost,
                                        productImageUrl: item.productImageUrl,
                                      });
                                    }}
                                  >
                                    Update
                                  </button>
                                </Col>
                                <Col>
                                  <button
                                    className="btn btn-block btn-danger"
                                    onClick={() => {
                                      this.setState({
                                        showDeleteModal: true,
                                        productId: item.id,
                                      });
                                    }}
                                  >
                                    Delete
                                  </button>
                                </Col>
                              </Row>
                            </>
                          ) : (
                            <button
                              className="btn btn-block btn-outline-primary mr-1"
                              onClick={() => {
                                this.setState({
                                  showServiceRequestModal: true,
                                  productId: item.id,
                                  name: item.name,
                                });
                              }}
                            >
                              Request Service
                            </button>
                          )}
                        </Card.Footer>
                      </Card>
                    </div>
                  ))}
              </Row>
              {this.state.result.length > this.state.end ? (
                <div className="d-flex justify-content-end my-4 text-end">
                  {this.state.start > 5 ? (
                    <button
                      className="text-danger mx-1"
                      style={{ border: "none", backgroundColor: "transparent" }}
                      onClick={showLess}
                    >
                      Less
                    </button>
                  ) : (
                    <></>
                  )}
                  <button
                    className="text-primary mx-1"
                    style={{ border: "none", backgroundColor: "transparent" }}
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
            <h3>No uploads yet</h3>
          )}
        </Container>
      </>
    );
  }
}
export default AllProducts;