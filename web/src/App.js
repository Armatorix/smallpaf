import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewUser from "./routes/NewUser.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
