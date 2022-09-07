import { Card, Col, Container, Row } from "react-bootstrap";

export default function Features(props) {
  return (
    <Container>
      <h2 className="text-center text-secondary">
        <span className="text-danger font-weight-bold">Features</span> we
        provide
      </h2>
      <Row className="py-2 py-md-4">
        <Col className="d-flex justify-content-center py-2 py-md-0">
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={require("../../Images/call-support.png")}
            />
            <Card.Body>
              <Card.Title>Get Support via phone</Card.Title>
              <Card.Text>
                If the product can be solved remotely then why waste time, we
                are there for you
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex justify-content-center py-2 py-md-0">
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={require("../../Images/Service_24x7.png")}
            />
            <Card.Body>
              <Card.Title>24x7 Customer Support</Card.Title>
              <Card.Text>
                If something goes south with your account we are there 24x7 to
                help you.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex justify-content-center py-2 py-md-0">
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={require("../../Images/large-community.png")}
            />
            <Card.Body>
              <Card.Title>Large Community</Card.Title>
              <Card.Text>
                Get all kind of product support and also report regarding the
                same
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="py-0 py-md-4">
        <Col className="d-flex justify-content-center py-2 py-md-0">
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={require("../../Images/data-transparency.png")}
            />
            <Card.Body>
              <Card.Title>Data Transparency</Card.Title>
              <Card.Text>
                Get a report of all the services you requested for without
                anything being hidden
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex justify-content-center py-2 py-md-0">
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={require("../../Images/privacy-policy.png")}
            />
            <Card.Body>
              <Card.Title>Data Security</Card.Title>
              <Card.Text>
                All your data is encrypted which means they are safe with us
                nothing goes out
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex justify-content-center py-2 py-md-0">
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={require("../../Images/data-driven-approach.png")}
            />
            <Card.Body>
              <Card.Title>Data Driven Approach</Card.Title>
              <Card.Text>
                Get on the boat with data driven approach i.e. to all the
                services you provide
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
