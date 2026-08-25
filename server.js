/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const express = require('express')
const compression = require('compression')
const morgan = require('morgan')

// Initialize Express app
const app = express()

// Middleware
app.use(compression())
app.use(morgan('combined'))

// Serve static assets from the PWA Kit build directory
const buildDir = path.join(__dirname, 'build')
app.use(express.static(buildDir, { maxAge: '1y', index: false }))

// Import and attach the compiled PWA Kit server handler
try {
    const {handler} = require('./build/server.js')
    
    // Route all other requests through PWA Kit's server-side rendering handler
    app.all('*', (req, res) => {
        return handler(req, res)
    })
    
    console.log('Successfully attached PWA Kit SSR handler.')
} catch (err) {
    console.error('Failed to load build/server.js. Make sure to run "npm run build" first.', err)
    
    // Fallback route if build folder is missing
    app.get('*', (req, res) => {
        res.status(500).send('Storefront build files not found. Please run a production build.')
    })
}

// Bind to Railway's assigned port (or fallback to 3000 locally)
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Asda Storefront server is running and listening on port ${PORT}`)
})