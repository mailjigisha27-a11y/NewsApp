import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import News from "./Components/News";

const App = () => {
  const [mode, setMode] = useState("light");

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
    document.body.style.backgroundColor =
      mode === "light" ? "#333" : "white";
  };

  const categories = [
    "general","business","entertainment",
    "health","science","sports","technology",
  ];

  return (
    <Router>
      <Navbar mode={mode} toggleMode={toggleMode} />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<News key="general" category="general" country="in" pageSize={10} />} />

        {/* One route per category */}
        {categories.map((cat) => (
          <Route
            key={cat}
            path={`/${cat}`}
            element={<News key={cat} category={cat} country="in" pageSize={10} />}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;