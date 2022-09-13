import { Component } from "react";
import { Alert, Container, Form, Row } from "react-bootstrap";
import Bottom from "../LandingPage/Bottom";
import TopBar from "../TopBar/TopBar";
import AllProducts from "./all-products";
import MyProducts from "./my-products";
import superagent from "superagent";
import Cookies from "universal-cookie";
import { AESDecrypt } from "cookie-cryptr";
import SignleProduct from "./SingleProduct";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyProduct: false,
      searchFor: "",
      cookies: new Cookies(),
      isAlert: false,
      alertMessage: "",
      alertType: "",
      searchResult: "",
      showSearchResult: false,
      currentUserRole: "",
      currentUser: "",
    };
  }

  componentDidMount() {
    if (this.state.cookies.get("token")) {
      superagent
        .get(
          " http://sbmauthapp-env.eba-9pddynji.us-west-2.elasticbeanstalk.com/validate"
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          this.setState({
            currentUserRole: res.body.userRole,
            currentUser: res.body.email,
          });
        })
        .catch(console.error);
    }
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

    let searchProduct = async (e) => {
      e.preventDefault();
      superagent
        .get(
          `http://sbm-products.us-west-2.elasticbeanstalk.com/product/${this.state.searchFor}`
        )
        .set(
          "Authorization",
          `Bearer ${AESDecrypt(this.state.cookies.get("token"), "test")}`
        )
        .then((res) => {
          this.setState({
            isAlert: false,
            searchResult: res.body.payload,
            showSearchResult: true,
          });
        })
        .catch((err) => {
          console.error(err.response.body.message);
          this.setState({
            isAlert: true,
            alertType: "danger",
            alertMessage: err.response.body.message,
          });
        });
    };

    return (
      <>
        <TopBar />
        <Container className="mt-3 p-2 px-4 text-secondary" fluid>
          {this.state.isAlert ? (
            <Alert key={this.state.alertType} variant={this.state.alertType}>
              {this.state.alertMessage}
            </Alert>
          ) : (
            <></>
          )}
          <Row>
            <div className="col-md">
              {this.state.isMyProduct ? (
                <h2 className="d-none d-md-block">My Products</h2>
              ) : (
                <h2>All Products</h2>
              )}
            </div>
            <div className="col-md-3 col-10 mt-md-0 mt-2">
              <Form onSubmit={searchProduct}>
                <div className="input-group rounded">
                  <input
                    type="search"
                    className="form-control rounded"
                    placeholder="Search product by id"
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        this.setState({
                          searchResult: "",
                        });
                      }
                      this.setState({
                        searchFor: e.target.value,
                      });
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary input-group-text border-0"
                    id="search-addon"
                    type="submit"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </Form>
            </div>
            <div className="col-md-1 col-2 mt-md-0 mt-2">
              <button className="btn btn-outline-primary" onClick={toggleMode}>
                {this.state.isMyProduct ? (
                  <i className="fa-solid fa-earth-americas"></i>
                ) : (
                  <i className="fa-solid fa-table-cells-large"></i>
                )}
              </button>
            </div>
          </Row>
          <hr />
          {this.state.showSearchResult && this.state.searchFor !== "" ? (
            <SignleProduct
              data={this.state.searchResult}
              currentUser={this.state.currentUser}
              currentUserRole={this.state.currentUserRole}
            />
          ) : (
            <>
              {this.state.isMyProduct ? (
                <MyProducts />
              ) : (
                <Container fluid>
                  <AllProducts />
                </Container>
              )}
            </>
          )}
        </Container>
        <Bottom />
      </>
    );
  }
}

export default Products;
