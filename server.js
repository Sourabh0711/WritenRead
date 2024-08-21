const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001; // Change the port if needed

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        // Read the existing message from the file
        fs.readFile(path.join(__dirname, 'message.txt'), 'utf-8', (err, data) => {
            if (err) {
                data = '';  // No file found or error, start with an empty string
            }

            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<head><title>Enter Message</title></head>');
            res.write(`<body>${data}<br><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>`);
            res.write('</html>');
            return res.end();
        });
    } else if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];

            // Ensure the message is decoded correctly
            const decodedMessage = decodeURIComponent(message.replace(/\+/g, ' '));

            // Overwrite the file with the new message
            fs.writeFile(path.join(__dirname, 'message.txt'), decodedMessage, err => {
                if (err) {
                    console.error('Error writing to file', err);
                }
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>My First Page</title></head>');
        res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
        res.write('</html>');
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
