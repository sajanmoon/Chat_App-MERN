import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("rahul@gmail.com");
  const [password, setPassword] = useState("Kumar1@");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await axios.post(
      "http://localhost:3000/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    dispatch(addUser(res.data));
    navigate("/feed");
  };
  return (
    <div className="card bg-base-100 w-96 shadow-xl mx-auto">
      <div className="card-body">
        <h2 className="card-title">LOGIN FORM</h2>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">EMAIL</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">PASSWORD</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <div className="card-actions justify-center my-4">
          <button className="btn btn-primary" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
