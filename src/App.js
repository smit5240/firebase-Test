import "./App.css";
import Home from "./Componets/Home";
import Login from "./Componets/Login";
import Navbar from "./Componets/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Componets/Register";
import { useEffect, useState } from "react";
import { auth } from "./Firebase";

function App() {
  // const auth = getAuth();
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user.uid);
      } else {
        setUser(null);
      }
    });
  }, [user]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register uid={user} />} />
        <Route exact path="/login" element={<Login uid={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
