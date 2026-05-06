const http = require('http');
const fs = require('fs');
const path = require('path');

// ВАЖЛИВО: Отримуємо порт саме так, як хоче воркшоп
const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    // Перевірка шляху та методу (суворо за умовою)
    if (req.url === '/items' && req.method === 'GET') {
        const filePath = path.join(process.cwd(), 'data.json');

        // Читаємо файл
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                // Якщо файлу немає, повертаємо пустий масив або 404
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "File not found" }));
                return;
            }

            // Успішна відповідь
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data); 
        });
    } else {
        // Умова: Unknown routes should not return 200
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT);