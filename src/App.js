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

  const token = jwt || localStorage.getItem("jwt");
  const isValidToken = token && token !== "null" && token !== "undefined";

  useEffect(() => {
    const freshToken = localStorage.getItem("jwt");
    const isValid = freshToken && freshToken !== "null" && freshToken !== "undefined";
    if (isValid && !user) {
      dispatch(getProfileAction());
    }
  }, [jwt]); 


  if (loading && isValidToken && !user) {
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
          {/* ✅ Uses isValidToken — reacts to jwt changes from Redux */}
          {!isValidToken ? (
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