// import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { BaseUrl } from "../../utils/baseurl";

const SignInForm = () => {
  const { authCheck } = useAuth();
  const navigate = useNavigate();
  const clientId =
    "712348172997-2nidak9kred0qfu7daifnknm1o973jms.apps.googleusercontent.com";

  const handleSuccess = async (credentialResponse: any) => {
    console.log("Google Login Success:", credentialResponse);

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

        console.log(response.data);

        if (response.status === 200) {
          await authCheck();
          console.log("Auth check");
          navigate("/dashboard");
          console.log("Login Success:", response.data);
        } else {
          console.error("Login Failed:", response.data);
        }
      } catch (error: any) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("Google Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default SignInForm;
