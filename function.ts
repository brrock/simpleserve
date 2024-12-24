import chalk from "chalk";
import { logger } from "hono/logger";
import { Hono } from "hono";
import { serve as serveAdaptor } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

interface Type {
  port?: number;
  directory?: string;
  debug?: boolean;
}

export default function serve(params: Type = {}) {
  const port = Number(params.port ?? 3000);
  const directory = params.directory ?? "dist";
  const debug = params.debug ?? false;

  const app = new Hono();

  // Add logger middleware
  if (debug) {
    app.use("*", logger());
  } else {
    app.use("*", (c, next) => next());
  }

  // Serve static files from the specified directory
  app.use("/*", serveStatic({ root: directory }));

  // Add a catch-all route for 404s
  app.notFound((c) => c.text("404 Not Found", 404));

  // Start the server
  serveAdaptor(
    {
      fetch: app.fetch,
      port,
    },
    () => {
      if (debug) {
        console.log(chalk.green("\n🚀 Server started!"));
        console.log(
          chalk.blue(`\n📁 Serving directory: ${chalk.yellow(directory)}`)
        );
        console.log(
          chalk.blue(`🔗 Local: ${chalk.yellow(`http://localhost:${port}`)}\n`)
        );
      }
    }
  );
}