#!/usr/bin/env node

import { Hono } from 'hono'
import { serve as serveNode} from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger'
import chalk from 'chalk'
import { Command } from 'commander'
const program = new Command()
program
  .name('simpleserve')
  .description('Simple static file server using Hono')
  .version('1.4.0')
  .option('-p, --port <number>', 'port to serve on', '3000')
  .option('-d, --dir <string>', 'directory to serve', '.')
  .parse(process.argv)

const options = program.opts()
const port = Number.parseInt(options.port)
const directory = options.dir

const app = new Hono()

// Add logger middleware
app.use('*', logger())

// Serve static files from the specified directory
app.use('/*', serveStatic({ root: directory }))

// Add a catch-all route for 404s
app.notFound((c) => {
  return c.text('404 Not Found', 404)
})

// Start the server
serveNode({
  fetch: app.fetch,
  port
}, () => {
  console.log(chalk.green("\n🚀 Server started!"))
  console.log(chalk.blue(`\n📁 Serving directory: ${chalk.yellow(directory)}`))
  console.log(chalk.blue(`🔗 Local: ${chalk.yellow(`http://localhost:${port}`)}\n`))
})

process.on('SIGINT', () => {
  console.log(chalk.red('\n👋 Shutting down server...'))
  process.exit(0)
})
