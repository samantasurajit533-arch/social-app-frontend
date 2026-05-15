import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage/HomePage";
import Authentication from "./pages/Authentication/Authentication";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { getProfileAction } from "./pages/Redux/Auth/auth.action";

// UI Imports
import { Typography, Box, CircularProgress, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

// 1. Define a Unique Modern Theme
const uniqueTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#07090d', // Deep Midnight
      paper: '#111827',   // Slate Blue
    },
    primary: {
      main: '#6366f1', // Electric Indigo
    },
  },
  shape: {
    borderRadius: 20, // Bold Rounded Corners for all components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '12px',
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(12px)', // Glass effect
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const jwt = auth.jwt || localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt && jwt !== "null" && !auth.user && !auth.error) {
      dispatch(getProfileAction(jwt));
    }
  }, [jwt, auth.user, auth.error, dispatch]);

  if (auth.loading && jwt && !auth.user && !auth.error) {
    return (
      <ThemeProvider theme={uniqueTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ letterSpacing: '2px', fontWeight: 'light' }}>
            SYNCHRONISING...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={uniqueTheme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          {!jwt || jwt === "null" ? (
            <Route path="/*" element={<Authentication />} /> 
          ) : (
            <Route path="/*" element={<HomePage />} />
          )}
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
