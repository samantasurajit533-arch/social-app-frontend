import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage/HomePage";
import Authentication from "./pages/Authentication/Authentication";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { getProfileAction } from "./pages/Redux/Auth/auth.action";
import { Typography, Box, CircularProgress, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const uniqueTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#07090d',
      paper: '#111827',
    },
    primary: {
      main: '#6366f1',
    },
  },
  shape: { borderRadius: 20 },
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
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const { jwt, user, loading } = useSelector(state => state.auth);

  // ✅ Always read fresh from localStorage too
  const token = jwt || localStorage.getItem("jwt");

  useEffect(() => {
    // ✅ Runs when jwt changes in Redux (after login/register)
    // AND on first mount (for page refresh with existing token)
    const freshToken = localStorage.getItem("jwt");
    if (freshToken && freshToken !== "null" && !user) {
      dispatch(getProfileAction());
    }
  }, [jwt]); // ✅ re-runs when jwt updates after login/register

  if (loading && token && !user) {
    return (
      <ThemeProvider theme={uniqueTheme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          height: '100vh', gap: 2
        }}>
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
          {!token || token === "null" ? (
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