import { configDotenv } from 'dotenv';
import express from 'express';
configDotenv();

console.log(process.env);


const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
