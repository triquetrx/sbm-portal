import { useState } from "react";
import { Container, Image, Modal, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import $ from "jquery";
import { AESDecrypt } from "cookie-cryptr";

export default function TopBarUser(props) {
  const [isLogout, setLogout] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const cookies = new Cookies();

  $(document).ready(function () {
    if (cookies.get("mode") === "dark") {
      setDarkMode(true);
      if (isDarkMode) {
        $(".App").css("background-color", "#201E1F");
        $(".dropdown-menu").css("background-color", "#040404");
        $(".App .text-secondary")
          .addClass("text-light")
          .removeClass("text-secondary");
        $(".App .bg-light").addClass("bg-dark").removeClass("bg-light");
        $(".App .text-danger")
          .addClass("text-white")
          .removeClass("text-danger");
        $(".App .btn-danger").addClass("btn-warning").removeClass("btn-danger");
        $(".App .bg-danger").addClass("bg-warning").removeClass("bg-danger");
        $(".App .btn-outline-danger")
          .addClass("btn-outline-warning")
          .removeClass("btn-outline-danger");
        $(".App nav")
          .css("background", "rgba( 32, 30, 31, 0.5 )")
          .css("border", "1px solid rgba( 255, 255, 255, 0.18 )");
        $("#basic-nav-dropdown").css("color", "#fff");
        $("#more-options").css("color", "#fff");
        $(".features-landing").css("background-color", "#000");
        $(".card")
          .css("background", "rgba( 32, 30, 31, 0.2 )")
          .css("border", "1px solid rgba( 255, 255, 255, 0.18 )");
      }
    } else {
      setDarkMode(false);
      $(".App").css("background-color", "#F0EDEE");
      $(".App .bg-warning").addClass("bg-danger").removeClass("bg-warning");
      $("#more-options").css("color", "#000");
      $(".dropdown-menu").css("background-color", "white");
      $(".App .btn-warning").addClass("btn-danger").removeClass("btn-warning");
      $(".App .btn-outline-warning")
        .addClass("btn-outline-danger")
        .removeClass("btn-outline-warning");
      $(".App .text-light")
        .addClass("text-secondary")
        .removeClass("text-light");
      $(".App .bg-dark").addClass("bg-light").removeClass("bg-dark");
      $(".App .text-white").addClass("text-danger").removeClass("text-white");
      $("nav")
        .css("background", "rgba(240, 237, 238, 0.7)")
        .css("border", "1px solid rgba(240, 237, 238, 0.5)");
      $("#basic-nav-dropdown").css("color", "#af1b3f");
      $(".card")
        .css("background", "rgba(240, 237, 238, 0.7)")
        .css("border", "1px solid rgba(240, 237, 238, 0.5)");
      $(".features-landing").css("background-color", "#ECE9EA");
    }
  });

  let logoutRemove = () => {
    cookies.remove("token");
    cookies.remove("name");
  };

  let show = () => {
    setLogout(true);
  };
  let handleClose = () => setLogout(false);

  return (
    <>
      <Modal
        show={isLogout}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="bg-light">
          <Modal.Title className="text-secondary">Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" bg-light">
          You sure, you want to logout?
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <button className="btn btn-outline-danger" onClick={handleClose}>
            No, not yet
          </button>
          <Link className="btn btn-primary" to="/login" onClick={logoutRemove}>
            Yes, Logout
          </Link>
        </Modal.Footer>
      </Modal>
      <div className="py-2" id="top-alert">
        <Container className="d-flex justify-content-center">
          <h6>Welcome Back, Note the session is only valid for 30 minutes</h6>
        </Container>
      </div>
      <Navbar expand="md" className="nav-landing-page" sticky="top">
        <Container fluid>
          <Navbar.Brand className="mr-auto" href="/">
            <Image
              src={require("../../Images/logo 4x4.png")}
              width="40"
              fluid
            />
          </Navbar.Brand>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#homeBar"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars" id="more-options"></i>
          </button>
          <Navbar.Collapse id="homeBar">
            <Nav className="mx-auto">
              <Nav.Link className="text-danger" id="home" href="/dashboard">
                Home
              </Nav.Link>
              <Nav.Link className="text-danger" href="/products">
                Products
              </Nav.Link>
              <Nav.Link href="/services" className="text-danger">
                Services
              </Nav.Link>
              <Nav.Link href="/add-products" className="text-danger">
                Add
              </Nav.Link>
              <Nav.Link className="text-danger d-block d-md-none" href="/me">
                About Me
              </Nav.Link>
              <Nav.Link className="text-danger" onClick={show}>
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div className="d-none d-md-block">
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <a href="/me" className=" text-secondary">
                  <i className="fa fa-user-circle pr-1"></i>
                  {AESDecrypt(cookies.get("name"), "test").split(" ")[0]}
                </a>
              </Navbar.Text>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </>
  );
}
