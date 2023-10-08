import React, { useEffect , useState} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = false;

export const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["auth-cookie"]);
  const [isError, setError] = useState("")
  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    axios
      .post(`${process.env.REACT_APP_API_BASE_PATH}/auth/login`, data, {
        "Content-Type": "application/json",
      })
      .then((response) => {
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(response.data.expiry);
        setCookie("auth-cookie", JSON.stringify(response.data), { path: "/", expires: d });
      })
      .catch((error) => {
        setError(error)
      });
  };

  useEffect(() => {
    if (cookies["auth-cookie"]) {
      navigate("/", { replace: true });
    }
  }, [cookies]);

  return (

    <div className="px-4 py-5 px-md-5 text-center text-lg-start  w-100 h-100" style={{ backgroundColor: "hsl(0, 0%, 96%)" }}>
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
                    <img src="https://cdn-icons-png.flaticon.com/512/6897/6897881.png" width={50} className="img-fluid" alt="" />
                    <span className="h1 fw-bold mb-3">
                      Tripat's AI
                    </span>
                  </div>

                  <h5 className="fw-normal mb-3 pb-3" >Sign into your account</h5>

                  <div className="form-outline mb-4">
                    <input type="email" id="email" placeholder="someone@gmail.com" required name="email" className="form-control" />
                    <label className="form-label" for="email">Email address</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input type="password" id="password" placeholder="****************" required name="password" className="form-control" />
                    <label className="form-label" for="password">Password</label>
                  </div>

                  <div className="text-center text-lg-start mt-4 pt-2">
                    <button type="submit" className="btn btn-primary btn-block mb-4">
                      Login
                    </button>
                    <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="/register"
                      className="link-danger">Register</a></p>
                    <span  className="link-danger">{isError}</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};