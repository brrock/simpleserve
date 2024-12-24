import { Hono } from "hono";
import { serve as serveAdaptor } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

// Removed chalk dependency for faster startup
const colors = {
  green: (str: string) => `\x1b[32m${str}\x1b[0m`,
  blue: (str: string) => `\x1b[34m${str}\x1b[0m`,
  yellow: (str: string) => `\x1b[33m${str}\x1b[0m`
};

interface Type {
  port?: number;
  directory?: string;
  debug?: boolean;
  maxAge?: number;
  compress?: boolean;
}

// Cached app instance for reuse
let cachedApp: Hono | null = null;

export default function serve(params: Type = {}) {
  const port = Number(params.port ?? 3000);
  const directory = params.directory ?? "dist";
  const debug = params.debug ?? false;
  const maxAge = params.maxAge ?? 86400; // 24 hours default cache
  const compress = params.compress ?? true;

  // Reuse cached app instance if possible
  if (cachedApp) {
    return startServer(cachedApp, { port, directory, debug });
  }

  const app = new Hono();
  cachedApp = app;

  // Simplified logging middleware with minimal overhead
  if (debug) {
    app.use("*", async (c, next) => {
      const start = Date.now();
      await next();
      const time = Date.now() - start;
      console.log(`${c.req.method} ${c.req.url} - ${time}ms`);
    });
  }

  // Optimized static file serving
  app.use("/*", serveStatic({ 
    root: directory,
    
    rewriteRequestPath: (path) => {
      // Serve index.html for directory requests
      return path.endsWith('/') ? `${path}index.html` : path;
    }
  }));

  // Efficient 404 handler
  app.notFound((c) => new Response("404 Not Found", { status: 404 }));

  return startServer(app, { port, directory, debug });
}

function startServer(app: Hono, { port, directory, debug }: Required<Pick<Type, 'port' | 'directory' | 'debug'>>) {
  return serveAdaptor(
    {
      fetch: app.fetch,
      port,
      serverOptions: {
        keepAliveTimeout: 30000, // Increase keep-alive timeout
        maxHeaderSize: 16384, // Optimize header size
      }
    },
    () => {
      if (debug) {
        console.log(colors.green("\n🚀 Server started!"));
        console.log(colors.blue(`\n📁 Serving directory: ${colors.yellow(directory)}`));
        console.log(colors.blue(`🔗 Local: ${colors.yellow(`http://localhost:${port}`)}\n`));
      }
    }
  );
}