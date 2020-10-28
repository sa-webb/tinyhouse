import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles/index.css";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Login } from "./sections/Login";
import { Viewer } from "./lib/types";
import { User } from "./sections/User";
import { Affix } from "antd";
import { AppHeader } from "./sections/AppHeader";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  return (
    <Router>
      <Affix offsetTop={0} className="app__affix-header">
        <AppHeader viewer={viewer} setViewer={setViewer}/>
      </Affix>
      <Switch>
        {/* ... */}
        <Route
          exact
          path="/login"
          render={(props) => <Login {...props} setViewer={setViewer} />}
        />
        <Route exact path="/user/:id" component={User} />
        {/* ... */}
      </Switch>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
