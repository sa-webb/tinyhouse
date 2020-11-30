import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import { connectDatabase } from "./database";
import { resolvers, typeDefs } from "./graphql";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());

  app.use(express.static(`${__dirname}/client`));
  // Single page application regardless of route - same index file.
  app.get("/*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });

  server.applyMiddleware({ app, path: "/api" });

  app.listen(process.env.PORT);

  console.log(`[app] : http://localhost:${process.env.PORT}`);
};

mount(express());
