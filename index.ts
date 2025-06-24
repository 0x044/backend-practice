import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

app.get('/health', (req, res)=>{
  res.json({status: 'OK', timestamp: new Date().toString()});
});

const startServer = async()=>{
  try {
    await testConnection();
    app.listen(PORT, ()=>{
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    })
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
