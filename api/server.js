// This is the updated code for your api/server.js file

// The http module is no longer needed for Vercel Serverless Functions
// const http = require('http');

/**
 * Processes the incoming data array to categorize its contents.
 * @param {Array<string|number>} data - The input array from the request body.
 * @returns {object} The processed data object.
 */
function processData(data) {
    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    let alphabeticalChars = '';

    // Regular expression to test if a string contains only alphabetic characters.
    const isAlphabet = /^[a-zA-Z]+$/;

    data.forEach(item => {
        // Check if the item is a finite number
        if (!isNaN(parseFloat(item)) && isFinite(item)) {
            const num = Number(item);
            sum += num;
            if (num % 2 === 0) {
                even_numbers.push(String(num));
            } else {
                odd_numbers.push(String(num));
            }
        // Check if the item is a string and purely alphabetical
        } else if (typeof item === 'string' && isAlphabet.test(item)) {
            alphabets.push(item.toUpperCase());
            alphabeticalChars += item;
        // Otherwise, it's a special character
        } else {
            special_characters.push(item);
        }
    });
    
    // Reverse the collected alphabetical characters
    let reversedAlphabets = alphabeticalChars.split('').reverse().join('');
    let concat_string = '';
    // Apply alternating case to the reversed string
    for (let i = 0; i < reversedAlphabets.length; i++) {
        if (i % 2 === 0) {
            concat_string += reversedAlphabets[i].toUpperCase();
        } else {
            concat_string += reversedAlphabets[i].toLowerCase();
        }
    }

    // Construct the final response object
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


/**
 * The main handler for Vercel Serverless Functions.
 * This function replaces the http.createServer and server.listen logic.
 * @param {object} req - The incoming request object.
 * @param {object} res - The outgoing response object.
 */
// Use module.exports for compatibility with Vercel's Node.js runtime
module.exports = (req, res) => {
    // Set common headers for CORS and content type
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // Only POST is implemented
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle pre-flight OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Route handling for the /bfhl endpoint
    if (req.url === '/bfhl' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                // Ensure body is not empty before parsing
                if (!body) {
                    throw new Error("Request body is empty.");
                }
                const parsedBody = JSON.parse(body);
                if (!parsedBody.data || !Array.isArray(parsedBody.data)) {
                    throw new Error("Invalid request format: 'data' key must be an array.");
                }

                const result = processData(parsedBody.data);

                // Send a 200 OK response with the processed data
                res.status(200).json(result);

            } catch (error) {
                // Send a 400 Bad Request response if an error occurs
                res.status(400).json({
                    is_success: false,
                    error: `Bad Request: ${error.message}`
                });
            }
        });
    } else if (req.url === '/bfhl' && req.method !== 'POST') {
        // Handle incorrect method for the endpoint
        res.status(405).json({ is_success: false, error: 'Method Not Allowed' });
    } else {
        // Handle all other routes with a 404 Not Found
        res.status(404).json({ is_success: false, error: 'Not Found' });
    }
};
