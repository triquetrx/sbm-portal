import { Component } from "react";
import { Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Bottom from "./Bottom";
import Features from "./Features";
import TopBarLandingPage from "./TopBarLandingPage";
import Customers from "./Customers";
import "../css/home.css";

class LandingPage extends Component {
  render() {
    return (
      <>
        <TopBarLandingPage />
        <Container className="mt-3 mb-3">
          <Row>
            <div className="d-block d-md-none">
              <Image src={require("../../Images/landing-page.png")} fluid />
            </div>
            <div className="col-md-5 mt-md-5 pt-md-5 pb-3 pb-md-0 text-center text-md-left">
              <h2 className="text-primary pt-md-5 mt-2 justify-content-md-start">
                Home,
                <br className="d-none d-md-block" /> Commercials, Auto
                <br className="d-none d-md-block" /> You name it, we'll be
                there.
                <br className="d-none d-md-block" />
              </h2>
              <p className="mt-1 text-secondary">
                All in one place to find a solution for your electronics or
                Automotive based products. One can offer or provide services at
                the same time. A new world awaits you other side.
              </p>
              <Link to="/signup" className="btn btn-outline-primary">
                Create an account
                <i className="ml-2 fa fa-arrow-right" />
              </Link>
            </div>
            <div className="col d-none d-md-block pt-0 mt-0">
              <Image src={require("../../Images/landing-page.png")} fluid />
            </div>
          </Row>
        </Container>
        <div className="features-landing text-secondary p-4" id="features">
          <Features />
        </div>
        <Customers />
        <Bottom />
      </>
    );
  }
}

export default LandingPage;
