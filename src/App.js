import {  useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.scss"
import { BrowserRouter,Navigate,Route,Routes } from "react-router-dom";
import { AuthContext } from "./Components/context/AuthContext";



 function App(){

  const {currentUser}=useContext(AuthContext)
 const ProtectedRoute = ({children})=>{
  console.log(children)
  if(!currentUser){
    return <Navigate to="/login"/>
  }
  return children
 };

  return(
    <BrowserRouter>
    <Routes>

<Route index element={<ProtectedRoute>
  <Home/>
</ProtectedRoute>}/>
<Route path="login" element={<Login/>}/>
<Route path="register" element={<Register/>}/>

    </Routes>
    
    </BrowserRouter>
  )
 }
 export default App ;