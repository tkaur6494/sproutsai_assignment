import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = false;

export const Register = () => {
  const navigate = useNavigate();
  const [isError, setError] = useState("")
  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    axios
      .post(`${process.env.REACT_APP_API_BASE_PATH}/auth/register`, data, {
        "Content-Type": "application/json",
      })
      .then((response) => {
        navigate("/login?account_created=1")
      })
      .catch((error) => {
        setError(error)
      });
  };

  return (

    <div  className="px-4 py-5 px-md-5 text-center text-lg-start  w-100 h-100" style={{ backgroundColor: "hsl(0, 0%, 96%)" }}>
      <div className="container  w-100 h-100">
        <div className="row gx-lg-5 align-items-center  w-100 h-100">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <img src="https://www.pngall.com/wp-content/uploads/9/Statistics.png" className="img-fluid" alt="" />
          </div>

          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="card">
              <div className="card-body py-5 px-md-5">
                <form
                  onSubmit={(e) => {
                    onSubmit(e);
                  }}
                >
                  <div className="d-flex align-items-center mb-3 pb-1">
                    <img src="https://cdn-icons-png.flaticon.com/512/6897/6897881.png" width={50} alt=""  className="img-fluid" />
                    <span className="h1 fw-bold mb-3">
                      Tripat's AI
                    </span>
                  </div>

                  <h5 className="fw-normal mb-3 pb-3" >Register your account</h5>

                  <div className="form-outline mb-4">
                    <input type="email" id="email" placeholder="someone@gmail.com" required name="email" className="form-control" />
                    <label className="form-label" for="email">Email address</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input type="password" id="password" placeholder="****************" required name="password" className="form-control" />
                    <label className="form-label" for="password">Password</label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block mb-4">
                    Signup
                  </button>
                  <span  className="link-danger">{isError}</span>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};