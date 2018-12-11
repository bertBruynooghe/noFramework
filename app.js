const http = require('http')
const server = http.createServer(function({ url }, response) {
  if (!url.indexOf('/test.appcache')) {
    console.log('loading appcache')
    response.writeHead(200, { 'Content-Type': 'text/cache-manifest' })
    response.write(
      `CACHE MANIFEST
      # ${Date.now()}
      FALLBACK
      /confirmation.html /offline.html
      `)
  } else if (!url.indexOf('/confirmation.html')) {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.write(
      wrapInPage(`
        Cache update requested.
        <form action="/" method="GET">
          <input type="submit" value="OK">
        </form>
      `)
    )
  } else if (!url.indexOf('/offline.html')) {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.write(
      wrapInPage(`You are offline. Try again later`)
    )
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.write(
      wrapInPage(`
        Cache was last updated at: ${new Date()}
        <form action="/confirmation.html" method="GET">
          <input type="submit" value="Request cache update">
        </form>
      `, true)
    )
  }
  response.end()
})

function wrapInPage (content, isCached = false) {
  return `
    <!DOCTYPE 'html'>
    <html${ isCached ? ' manifest="/test.appcache"' : ''}>
    <head>
    <title>Test</title>
    <body>
    ${content}
    </body>
    </html>`
}

server.listen(3000)
console.log('server started at port 3000')