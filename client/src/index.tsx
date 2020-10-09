import React from "react";
import ReactDOM from "react-dom";

import "antd/dist/antd.css"

import { Listings } from "./sections/Listings/Listings";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Listings title="TinyHouse Listings" />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
