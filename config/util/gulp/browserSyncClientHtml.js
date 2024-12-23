module.exports = (data, title) => {
    return `<!DOCTYPE html>
    <html lang="pl">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${title}</title>
    </head>

    <body>
        <pre>${data}</pre>        
        <script async src="/browser-sync/browser-sync-client.js"></script>
    </body>

    </html>`
}