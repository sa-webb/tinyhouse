import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useMutation,
} from "@apollo/client";
import { Affix, Layout, Spin } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AppHeaderSkeleton } from "./lib/components/AppHeaderSkeleton";
import { LOG_IN } from "./lib/graphql/mutations/Login";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/Login/__generated__/LogIn";
import { Viewer } from "./lib/types";
import { AppHeader } from "./sections/AppHeader";
import { Login } from "./sections/Login";
import { User } from "./sections/User";
import { Listing } from "./sections/Listing";
import { Listings } from "./sections/Listings";
import { Home } from "./sections/Home";
import { Stripe } from "./sections/Stripe";
import { Host } from "./sections/Host";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const token = sessionStorage.getItem("token");

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),

  headers: {
    "X-CSRF-TOKEN": token || "",
  },
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const stripePromise = loadStripe(process.env.REACT_APP_S_PUBLISHABLE_KEY!);

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    },
  });

  const logInRef = useRef(logIn);
  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Tinyhouse" />
        </div>
      </Layout>
    );
  }

  return (
    <Router>
      <Affix offsetTop={0} className="app__affix-header">
        <AppHeader viewer={viewer} setViewer={setViewer} />
      </Affix>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/listings/:location" component={Listings} />
        <Route
          exact
          path="/listing/:id"
          render={(props) => (
            <Elements stripe={stripePromise}>
              <Listing {...props} viewer={viewer} />
            </Elements>
          )}
        />
        <Route
          exact
          path="/host"
          render={(props) => <Host {...props} viewer={viewer} />}
        />
        <Route
          exact
          path="/login"
          render={(props) => <Login {...props} setViewer={setViewer} />}
        />
        <Route
          exact
          path="/stripe"
          render={(props) => (
            <Stripe {...props} viewer={viewer} setViewer={setViewer} />
          )}
        />
        <Route
          exact
          path="/user/:id"
          render={(props) => (
            <User {...props} viewer={viewer} setViewer={setViewer} />
          )}
        />
      </Switch>
    </Router>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
