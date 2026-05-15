import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage/HomePage";
import Authentication from "./pages/Authentication/Authentication";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { getProfileAction } from "./pages/Redux/Auth/auth.action";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    
    if (auth.jwt && !auth.user) {
      dispatch(getProfileAction(auth.jwt));
    }
  }, [auth.jwt, dispatch]);

  if (auth.loading && auth.jwt && !auth.user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* যদি JWT না থাকে তবে শুধু Authentication (Login/Register) দেখাবে */}
        {!auth.jwt ? (
          <Route path="/*" element={<Authentication />} /> 
        ) : (
        
          <Route path="/*" element={<HomePage />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
