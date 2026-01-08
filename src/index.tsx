import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()

// Serve static files
app.use('/css/*', serveStatic())
app.use('/js/*', serveStatic())
app.use('/audio/*', serveStatic())

// Serve index.html at root
app.get('/', serveStatic({ path: './index.html' }))

// Fallback to index.html for any other routes
app.get('*', serveStatic({ path: './index.html' }))

export default app
