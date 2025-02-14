import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const irAContact = () => {
    navigate("/");
  };

  return (
  <>
  <div>Page Not Found (404)</div>;
  <button className="btn btn-danger" onClick={irAContact}>Back</button>
  </>
  )
};

export default NotFound;
