import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage/HomePage";
import Authentication from "./pages/Authentication/Authentication";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { getProfileAction } from "./pages/Redux/Auth/auth.action";
import { Typography, Box, CircularProgress } from "@mui/material";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  // Use the JWT from Redux state for consistency
  const jwt = auth.jwt || localStorage.getItem("jwt");

  useEffect(() => {
    // Only fetch profile if we have a valid-looking JWT and no user yet
    if (jwt && jwt !== "null" && !auth.user && !auth.error) {
      dispatch(getProfileAction(jwt));
    }
  }, [jwt, auth.user, auth.error, dispatch]);

  // FIX: Added 'auth.error' check so it doesn't get stuck on loading if the API fails
  if (auth.loading && jwt && !auth.user && !auth.error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
        <CircularProgress />
        <Typography variant="h6">Loading Profile...</Typography>
      </Box>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* If no valid JWT, show Login/Register. If JWT exists, show Home. */}
        {!jwt || jwt === "null" ? (
          <Route path="/*" element={<Authentication />} /> 
        ) : (
          <Route path="/*" element={<HomePage />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
