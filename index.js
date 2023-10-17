import OpenAI from 'openai';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3004;

app.use(cors()); 

app.use(bodyParser.json());

app.use(express.json());

app.get('/hi', (req, res) => {
    try {
        res.status(200).json({ message: 'Hi bro, Srinivas here' });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: error });
    }
});


app.post('/forward', async (req, res) => {
  try {
    const targetUrl = 'https://api.openai.com/v1/chat/completions'; // Replace with the URL you want to send the POST request to

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: JSON.stringify({
            stream: req.body.stream,
            model: "gpt-3.5-turbo",
            max_tokens: 1000,
            temperature: 0.7,
            n: 1,
            messages: req.body.messages,
      }),
      headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`},
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    console.log("sending data", response);

    // Stream the response back to the client
    response.body.pipe(res);

  } catch (error) {
    // Handle errors appropriately
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
