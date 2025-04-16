import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Provider store={store}>
        {/* <PersistGate loading={<div>Loading...</div>} persistor={persistor}> */}
        {/* </PersistGate> */}
        <App />
      </Provider>
    </AuthProvider>
  </StrictMode>
);
