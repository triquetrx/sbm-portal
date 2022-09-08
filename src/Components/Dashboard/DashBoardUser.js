import { AESDecrypt } from "cookie-cryptr";
import { useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import Cookies from "universal-cookie";
import $ from "jquery";
import { Link, Navigate } from "react-router-dom";
import News from "./News";

export default function DashBoardUser(props) {
  const [greeting, setGreetings] = useState("");
  const [isDarkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const cookies = new Cookies();

  $(document).ready(function () {
    setCurrentPage("");
    if (cookies.get("mode") === "dark") {
      setDarkMode(true);
      $(".App").css("background-color", "#201E1F");
      $(".dropdown-menu").css("background-color", "#040404");
      $(".App .text-secondary")
        .addClass("text-light")
        .removeClass("text-secondary");
      $(".App .bg-light").addClass("bg-dark").removeClass("bg-light");
      $(".App .text-danger").addClass("text-white").removeClass("text-danger");
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

  let toggleMode = () => {
    if (isDarkMode) {
      cookies.set("mode", "light");
      setDarkMode(true);
      setCurrentPage(window.location.href);
    } else {
      cookies.set("mode", "dark");
      setDarkMode(false);
      setCurrentPage(window.location.href);
    }
  };

  const array = [
    {
      name: "Products",
      description: "View the product you need the service for",
      url: "/products",
      button: "Explore",
      icon: "pl-2 fa-solid fa-cart-shopping",
    },
    {
      name: "Add",
      description:
        "Add new product for which the services will be provided by you",
      url: "/add",
      button: "Add Product",
      icon: "pl-2 fa-solid fa-plus-circle",
    },
    {
      name: "Services",
      description: "Get the service requests for your products",
      url: "/services",
      button: "Lets see",
      icon: "pl-2 fa-solid fa-wrench",
    },
    {
      name: "Track Request",
      description:
        "Track of your own service requests with the help of request id",
      url: "/services",
      button: "Track",
      icon: "pl-2 fa-brands fa-searchengin",
    },
    {
      name: "About me",
      description: "Change your password or any other information you want",
      url: "/me",
      button: "My Data",
      icon: "pl-2 fa-solid fa-circle-user",
    },
  ];

  useEffect(() => {
    var hrs = new Date().getHours();
    if (hrs < 12) {
      setGreetings("Good Morning");
    } else if (hrs >= 12 && hrs <= 17) {
      setGreetings("Good Afternoon");
    } else if (hrs >= 17 && hrs <= 24) {
      setGreetings("Good Evening");
    }
  }, []);

  return (
    <>
      <Container fluid className="mt-4 py-2 px-5 text-secondary">
        <Row>
          <div className="col-9 col-md-11">
            <h2>
              {greeting},{" "}
              <span className="text-danger">
                {cookies.get("token") ? (
                  AESDecrypt(cookies.get("name"), "test")
                ) : (
                  <Navigate to="/login" />
                )}
              </span>
            </h2>
          </div>
          <div className="col-3 col-md-1">
            <Link
              type="checkbox"
              id="mode-toggle"
              className="btn btn-outline-primary px-2"
              style={{ width: "100%" }}
              onClick={toggleMode}
              to={currentPage}
            >
              {isDarkMode ? (
                <>
                  <i className="fa-solid fa-sun"></i>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-moon"></i>
                </>
              )}
            </Link>
          </div>
        </Row>
        <hr />
        <h4>Most Frequently Visited</h4>
        <Row className="d-flex justify-content-center">
          {array.map((item, key) => (
            <div key={key} className="m-1 mt-3 mb-2">
              <Card style={{ width: "14rem" }}>
                <Card.Body className="text-secondary">
                  <Card.Title style={{ height: "2.6rem" }}>
                    {item.name}
                  </Card.Title>
                  <Card.Text style={{ height: "5rem" }}>
                    {item.description}
                  </Card.Text>
                  <a className="btn btn-outline-primary" href={item.url}>
                    {item.button}
                    <i className={item.icon} />
                  </a>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
        <hr />
        <News />
      </Container>
    </>
  );
}
