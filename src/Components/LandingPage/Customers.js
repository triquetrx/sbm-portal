import { Card, Col, Container, Row } from "react-bootstrap";

export default function Customers(props) {
  return (
    <Container className="p-4">
      <h2 className="text-center text-secondary pb-2">
        <span className="text-danger font-weight-bold">Our Customers</span> say
      </h2>
      <section className="card d-flex judtify-content-center mt-4">
        <Row>
          <div className="d-flex col d-md-none">
            <Card.Img
              variant="top"
              src={require("../../Images/harps-joseph.jpg")}
            />
          </div>
          <div className="col-md-8">
            <Card.Body>
              <Card.Title>Harps Joseph Says</Card.Title>
              <Card.Text className="h6">
                <i className="fa-solid fa-quote-left pr-1"></i>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut
                incidunt autem blanditiis qui, porro rem eaque, numquam soluta
                officia minima voluptates? Incidunt nesciunt, id numquam fugit
                saepe sunt inventore quae reprehenderit corrupti iusto ullam
                aliquam doloribus? Repudiandae sequi distinctio nam amet dolore
                repellat, assumenda corrupti velit suscipit, tenetur ut maxime!
                <i className="fa-solid fa-quote-right pl-1"></i>
              </Card.Text>
            </Card.Body>
          </div>
          <Col className="d-none d-md-flex justify-content-end">
            <Card.Img
              variant="top"
              src={require("../../Images/harps-joseph.jpg")}
            />
          </Col>
        </Row>
        <div></div>
      </section>
      <section className="card d-flex judtify-content-center mt-4">
        <Row>
          <Col className="d-flex justify-content-end">
            <Card.Img
              variant="top"
              src={require("../../Images/Marita_Brathen.jpg")}
            />
          </Col>
          <div className="col-md-8">
            <Card.Body>
              <Card.Title>Marita Bråthen Says</Card.Title>
              <Card.Text className="h6">
                <i className="fa-solid fa-quote-left pr-1"></i>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut
                incidunt autem blanditiis qui, porro rem eaque, numquam soluta
                officia minima voluptates? Incidunt nesciunt, id numquam fugit
                saepe sunt inventore quae reprehenderit corrupti iusto ullam
                aliquam doloribus? Repudiandae sequi distinctio nam amet dolore
                repellat, assumenda corrupti velit suscipit, tenetur ut maxime!
                <i className="fa-solid fa-quote-right pl-1"></i>
              </Card.Text>
            </Card.Body>
          </div>
        </Row>
        <div></div>
      </section>
      <section className="card d-flex judtify-content-center mt-4">
        <Row>
          <div className="col d-block d-md-none">
            <Card.Img
              variant="top"
              src={require("../../Images/ayo_ogunseinde.jpg")}
            />
          </div>
          <div className="col-md-8">
            <Card.Body>
              <Card.Title>Ayo Ogunseinde Says</Card.Title>
              <Card.Text className="h6">
                <i className="fa-solid fa-quote-left pr-1"></i>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut
                incidunt autem blanditiis qui, porro rem eaque, numquam soluta
                officia minima voluptates? Incidunt nesciunt, id numquam fugit
                saepe sunt inventore quae reprehenderit corrupti iusto ullam
                aliquam doloribus? Repudiandae sequi distinctio nam amet dolore
                repellat, assumenda corrupti velit suscipit, tenetur ut maxime!
                <i className="fa-solid fa-quote-right pl-1"></i>
              </Card.Text>
            </Card.Body>
          </div>
          <Col className="d-none d-md-flex justify-content-end">
            <Card.Img
              variant="top"
              src={require("../../Images/ayo_ogunseinde.jpg")}
            />
          </Col>
        </Row>
        <div></div>
      </section>
      <Row className="py-2 py-md-0">
        <Col>-</Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
