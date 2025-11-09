import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import "./index.css";

const domain = "dev-nztcfse6ll2ykwqu.us.auth0.com";
const clientId = "UH5n58Fwn0T0LL528w2Wja1fr7rcrF0o";

const root = createRoot(document.getElementById("root")!);

/*
root.render(
  <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
      >
      <App />
</Auth0Provider>,
);
*/

root.render(
  <React.StrictMode>
      <App />
        </React.StrictMode>
	);