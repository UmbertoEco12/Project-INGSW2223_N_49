import dotenv from 'dotenv';
dotenv.config();
import http from 'http'
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import router from './routes/apiRoutes.js';

import { createProxyMiddleware } from 'http-proxy-middleware'
const PORT = process.env.PORT || 3000;
const API_URL: string | undefined = process.env.API_URL;

const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.raw({ type: 'multipart/form-data', limit: '10mb' }));

app.use('/api', router);
// Set up WebSocket proxy
const wsProxy = createProxyMiddleware('/ratatouille-websocket', {
    target: API_URL,
    ws: true,
    changeOrigin: true,
});

// Use the WebSocket proxy middleware
app.use('/ratatouille-websocket/**', wsProxy);

app.get("*", (req: Request, res: Response, next: NextFunction): void => {
    try {
        console.log("Request received:", req.url);
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    } catch (error) {
        next(error);
    }
});


server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})