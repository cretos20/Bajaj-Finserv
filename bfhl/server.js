const http = require('http');

function processData(data) {
    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    let alphabeticalChars = '';

    const isAlphabet = /^[a-zA-Z]+$/;

    data.forEach(item => {
        if (!isNaN(parseFloat(item)) && isFinite(item)) {
            const num = Number(item);
            sum += num;
            if (num % 2 === 0) {
                even_numbers.push(String(num));
            } else {
                odd_numbers.push(String(num));
            }
        } else if (typeof item === 'string' && isAlphabet.test(item)) {
            alphabets.push(item.toUpperCase());
            alphabeticalChars += item;
        } else {
            special_characters.push(item);
        }
    });
    
    let reversedAlphabets = alphabeticalChars.split('').reverse().join('');
    let concat_string = '';
    for (let i = 0; i < reversedAlphabets.length; i++) {
        if (i % 2 === 0) {
            concat_string += reversedAlphabets[i].toUpperCase();
        } else {
            concat_string += reversedAlphabets[i].toLowerCase();
        }
    }

    const response = {
        is_success: true,
        user_id: "nitya_raval_20092004",
        email: "nitya.mayankkumar2022@vitstudent.ac.in",
        roll_number: "22BCE0417",
        odd_numbers,
        even_numbers,
        alphabets,
        special_characters,
        sum: String(sum),
        concat_string
    };

    return response;
}

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.url === '/bfhl' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                if (!parsedBody.data || !Array.isArray(parsedBody.data)) {
                    throw new Error("Invalid request format: 'data' key must be an array.");
                }

                const result = processData(parsedBody.data);

                res.writeHead(200);
                res.end(JSON.stringify(result));

            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    is_success: false,
                    error: `Bad Request: ${error.message}`
                }));
            }
        });
    } else if (req.url === '/bfhl' && req.method !== 'POST') {
        res.writeHead(405);
        res.end(JSON.stringify({ is_success: false, error: 'Method Not Allowed' }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ is_success: false, error: 'Not Found' }));
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoint is available at http://localhost:${PORT}/bfhl`);
});

module.exports = server;