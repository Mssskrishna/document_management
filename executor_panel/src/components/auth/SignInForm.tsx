import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router";
import axios from "axios";
import { baseUrl } from "../../utils/constants";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoggedIn, setUser } from "../../features/user/userSlice";

const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clientId =
    "712348172997-2nidak9kred0qfu7daifnknm1o973jms.apps.googleusercontent.com";

  const performLogout = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/logout`, {
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

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const response = await axios.post(
          `${baseUrl}/auth/login`,
          { credential: credentialResponse.credential },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const data = response.data;
        const user = data.body.data;

        if (!user.hasExecutorAccess) {
          toast.error(
            "Unable to login into panel , please try with different email"
          );
          performLogout();
          dispatch(setLoggedIn(false));
          return;
        }
        dispatch(setUser(user));
        dispatch(setLoggedIn(true));

        if (response.status === 200) {
          navigate("/");
        } else {
          throw "Login Failed";
        }
      } catch (error: any) {
        dispatch(setLoggedIn(false));
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
        src="/images/logo/logo-icon.svg" // Replace with your logo path
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
