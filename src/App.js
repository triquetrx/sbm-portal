import { Route, Routes } from "react-router-dom";
import "./App.css";
import AboutMe from "./Components/About User/about-me";
import Dashboard from "./Components/Dashboard/Dashboard";
import ForgotPassword from "./Components/LandingPage/ForgotPassword";
import LandingPage from "./Components/LandingPage/LandingPage";
import Login from "./Components/LandingPage/Login";
import Signup from "./Components/LandingPage/Signup";
import PageNotFound from "./Components/PageNotFound";
import AddProduct from "./Components/Product/add-product";
import Products from "./Components/Product/Products";
import ReportsAdmin from "./Components/Services/ReportsAdmin";
import Services from "./Components/Services/Services";
import Users from "./Components/Users/Users";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/add-products" element={<AddProduct />} />
        <Route path="/me" element={<AboutMe />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reports" element={<ReportsAdmin />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
}

export default App;
