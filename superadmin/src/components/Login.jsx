import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "../AuthContext";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../utils/baseUrl";
import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
// import { setLoggedIn, setUser } from "../features/userSlice";

const SignInForm = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const clientId =
    "712348172997-2nidak9kred0qfu7daifnknm1o973jms.apps.googleusercontent.com";

  const performLogout = async () => {
    try {
      const res = await fetch(`${BaseUrl}/auth/logout`, {
        credentials: "include",
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const response = await axios.post(
          `${BaseUrl}/auth/login`,
          { credential: credentialResponse.credential },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const data = response.data;
        const user = data.body.data;

        if (!user.isAdmin) {
          await performLogout();
          toast.error("You don't access to super admin");
          return;
        }
        setUser(user);
        if (response.status === 200) {
          navigate("/");
        } else {
          throw "Login Failed";
        }
      } catch (error) {
        // dispatch(setLoggedIn(false));
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        toast.error(error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-dark text-gray-800 px-4">
      {/* Logo */}
      <img
        src="/images/logo.svg" // Replace with your logo path
        alt="Logo"
        className="h-20 mb-6"
      />

      {/* Title */}
      <h1 className="text-3xl font-semibold mb-10 text-center text-white">
        Document Platform Executive Panel
      </h1>

      {/* Google Login */}
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Google Login Failed")}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default SignInForm;
