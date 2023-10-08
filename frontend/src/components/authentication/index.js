import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = false;

export const LoginRegister = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["auth-cookie"]);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    axios
      .post(`${process.env.REACT_APP_API_BASE_PATH}/auth/login`, data, {
        "Content-Type": "application/json",
      })
      .then((response) => {
        var d = new Date(0); 
        d.setUTCSeconds(response.data.expiry);
        setCookie("auth-cookie", JSON.stringify(response.data), { path: "/", expires:d });
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (cookies["auth-cookie"]) {
      navigate("/", { replace: true });
    }
  }, [cookies, navigate]);

  return (
    <form
      onSubmit={(e) => {
        onSubmit(e);
      }}
    >
      <h3>Sign In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter email"
          required
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Enter password"
          required
        />
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};
