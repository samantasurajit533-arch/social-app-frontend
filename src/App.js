import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage/HomePage";
import Authentication from "./pages/Authentication/Authentication";
import {  Message } from "@mui/icons-material";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Authentication/Login"; // Adjust path if needed
import { getProfileAction } from "./pages/Redux/Auth/auth.action";
import Register from "./pages/Authentication/Register";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const jwt = localStorage.getItem("jwt");
  // Inside App.js
//useEffect(() => {
  // Use the jwt from Redux state (auth.jwt)
  //if (auth.jwt && !auth.user) {
  //  dispatch(getProfileAction(auth.jwt));
 // }}, [auth.jwt, auth.user, dispatch]); // Added auth.user as a dependency
  useEffect(() => {
  if (auth.jwt && !auth.user) {
    dispatch(getProfileAction(auth.jwt));
  }
}, [auth.jwt]);


if (auth.loading && !auth.user) {
  return <div>Loading...</div>;
}
  return (
    <div className="App">
  
  {/*!auth.jwt && (
    <>
      <Route path="/login" element={<Authentication><Login /></Authentication>} />
      <Route path="/register" element={<Authentication><Register /></Authentication>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </>
  )}

   Protected Routes 
  {auth.jwt && (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </>
  )*/}

  {/* When there is NO jwt, ONLY render Authentication */}
<Routes>
  {!auth.jwt ? (
    <Route path="/*" element={<Authentication />} /> 
  ) : (
    <>

      {/* 2. All other pages - With Sidebar (HomePage layout) */}
      <Route path="/*" element={<HomePage />} />
    </>
  )}
</Routes>



</div>)};

export default App; 