import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";


function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/addcourse" element={<Add/>}/>
      <Route path="/listcourse" element={<List/>}/>
     </Routes>
    </>
  );
}

export default App;
