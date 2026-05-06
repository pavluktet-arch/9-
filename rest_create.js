const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;
const filePath = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
    // 1. Перевіряємо метод POST та шлях /items
    if (req.method === 'POST' && req.url === '/items') {
        let body = '';

        // 2. Збираємо дані, які надсилає клієнт
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newItem = JSON.parse(body);

                // 3. Читаємо файл, щоб додати нові дані до існуючих
                fs.readFile(filePath, 'utf8', (err, data) => {
                    let items = [];
                    if (!err) {
                        items = JSON.parse(data);
                    }

                    // Додаємо новий елемент
                    items.push(newItem);

                    // 4. Записуємо оновлений список у файл
                    fs.writeFile(filePath, JSON.stringify(items, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500);
                            return res.end();
                        }

                        // 5. Повертаємо 201 Created та сам об'єкт
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newItem));
                    });
                });
            } catch (e) {
                // Якщо JSON невалідний
                res.writeHead(400);
                res.end();
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});