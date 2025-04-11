import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Dashboard";
import { useEffect } from "react";
import ProtectedPage from "./components/ProtectedPage";
import Pending from "./components/applications/Pending";
import { Toaster } from "react-hot-toast";
export default function App() {
  useEffect(() => {}, []);
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route
              index
              path="/"
              element={
                <ProtectedPage>
                  <Home />
                </ProtectedPage>
              }
            />

            {/* Others Page */}
            <Route
              path="/profile"
              element={
                <ProtectedPage>
                  <UserProfiles />
                </ProtectedPage>
              }
            />

            <Route
              path="/applications"
              element={
                <ProtectedPage>
                  <Pending />
                </ProtectedPage>
              }
            />

            <Route path="/blank" element={<Blank />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster
        containerStyle={{
          zIndex: "999999",
        }}
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
}
