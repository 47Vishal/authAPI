import { CssBaseline } from "@mui/material";
import Navbar from "../navbar";
import { Outlet } from "react-router-dom";
 const Layout = () => {
   return (
    <>
    <CssBaseline/>
    <Navbar />
    <Outlet/>
    </>
     
   );
 };
 
 export default Layout;