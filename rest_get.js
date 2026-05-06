const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    // Перевіряємо, чи шлях починається з /items/
    if (req.method === 'GET' && req.url.startsWith('/items/')) {
        
        // Витягуємо ID з URL (все, що після останнього слеша)
        const id = parseInt(req.url.split('/').pop());

        const filePath = path.join(__dirname, 'data.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error reading file");
            }

            const items = JSON.parse(data);
            // Шукаємо елемент із потрібним ID
            const item = items.find(i => i.id === id);

            if (item) {
                // Якщо знайшли — повертаємо 200 і об'єкт
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(item));
            } else {
                // Якщо не знайшли — повертаємо 404
                res.writeHead(404);
                res.end();
            }
        });

    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});