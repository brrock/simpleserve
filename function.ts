import chalk from "chalk";
import { logger } from "hono/logger";
import { Hono } from "hono/quick";
import { serve as serveAdaptor } from "@hono/node-server";
import { serveStatic } from "hono/serve-static";

interface type {
  port: number;
  directory: string;
  debug: boolean;
}
export default function serve(params: type) {
  const port = Number.parseInt(params.port.toString());
  const directory = params.directory;

  const app = new Hono();

  // Add logger middleware
  app.use("*", logger());

  // Serve static files from the specified directory
  // @ts-expect-error
  app.use("/*", serveStatic({ root: directory }));

  // Add a catch-all route for 404s
  app.notFound((c) => {
    return c.text("404 Not Found", 404);
  });
  // Add a catch-all route for 404s

  // Start the server
  serveAdaptor(
    {
      fetch: app.fetch,
      port,
    },
    () => {
      if (params.debug) {
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
