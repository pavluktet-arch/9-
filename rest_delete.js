const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;
const filePath = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
    // 1. Перевіряємо метод DELETE та чи шлях починається з /items/
    if (req.method === 'DELETE' && req.url.startsWith('/items/')) {
        const id = parseInt(req.url.split('/').pop());

        // 2. Читаємо файл
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end();
            }

            let items = JSON.parse(data);
            const initialLength = items.length;

            // 3. Фільтруємо масив, залишаючи всі елементи, крім того, що видаляємо
            items = items.filter(i => i.id !== id);

            // 4. Перевіряємо, чи щось було видалено
            if (items.length < initialLength) {
                // 5. Записуємо оновлений масив назад у файл
                fs.writeFile(filePath, JSON.stringify(items, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500);
                        return res.end();
                    }
                    // Повертаємо успіх
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            } else {
                // Якщо ID не знайдено — 404
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
    console.log(`Server for deleting items on port ${PORT}`);
});