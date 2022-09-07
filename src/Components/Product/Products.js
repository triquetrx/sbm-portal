import { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Bottom from "../LandingPage/Bottom";
import TopBar from "../TopBar/TopBar";
import AllProducts from "./all-products";
import MyProducts from "./my-products";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyProduct: false,
    };
  }
  render() {
    let toggleMode = () => {
      if (this.state.isMyProduct) {
        this.setState({
          isMyProduct: false,
        });
      } else {
        this.setState({
          isMyProduct: true,
        });
      }
    };

    return (
      <>
        <TopBar />
        <Container className="mt-3 p-2 px-4 text-secondary" fluid>
          <Row>
            <Col>
              {this.state.isMyProduct ? (
                <h2>My Products</h2>
              ) : (
                <h2>All Products</h2>
              )}
            </Col>
            <div className="col-2">
              <button
                className="btn btn-outline-primary btn-block"
                onClick={toggleMode}
              >
                {this.state.isMyProduct ? "All Products" : "My Products"}
              </button>
            </div>
          </Row>
          <hr />
          {this.state.isMyProduct ? <MyProducts /> : <AllProducts />}
        </Container>
        <Bottom />
      </>
    );
  }
}

export default Products;
