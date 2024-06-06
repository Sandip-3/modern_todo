import Login from "./pages/login";
import SignUp from "./pages/signup";
import { Routes, Route } from "react-router-dom";
import Verification from "./pages/verfiy";
import ProtectedRoute from "./components/protected";
import Home from "./pages/home";
import Layout from "./pages/layout";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verification />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
