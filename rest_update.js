const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;
const filePath = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
    // 1. Перевіряємо метод PUT та чи шлях починається з /items/
    if (req.method === 'PUT' && req.url.startsWith('/items/')) {
        const id = parseInt(req.url.split('/').pop());
        let body = '';

        // 2. Збираємо дані з тіла запиту
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updatedData = JSON.parse(body);

                // 3. Читаємо файл
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        return res.end();
                    }

                    let items = JSON.parse(data);
                    // 4. Шукаємо індекс елемента
                    const index = items.findIndex(i => i.id === id);

                    if (index !== -1) {
                        // 5. Оновлюємо дані (зберігаємо той самий ID)
                        items[index] = { ...items[index], ...updatedData, id };

                        // 6. Записуємо оновлений масив у файл
                        fs.writeFile(filePath, JSON.stringify(items, null, 2), (err) => {
                            if (err) {
                                res.writeHead(500);
                                return res.end();
                            }
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(items[index]));
                        });
                    } else {
                        // Якщо ID не існує
                        res.writeHead(404);
                        res.end();
                    }
                });
            } catch (e) {
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
    console.log(`Server updating items on port ${PORT}`);
});