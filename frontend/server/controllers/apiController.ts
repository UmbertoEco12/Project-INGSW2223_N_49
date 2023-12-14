import axios, { AxiosResponse, AxiosError } from "axios";
import { Request, Response } from 'express';

const API_URL: string | undefined = process.env.API_URL;

export const jsonProxy = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestBody = req.body;
        const url = req.originalUrl.replace('/api', '');
        const token = req.headers.authorization;
        console.log('url', url);
        console.log('body', requestBody);
        // Make the request
        const response: AxiosResponse = await axios({
            method: req.method as any,
            url: `${API_URL}${url}`,
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            data: requestBody,
        });

        // Set the headers from the remote API in the response
        const headers = response.headers;
        Object.keys(headers).forEach(header => {
            res.setHeader(header, headers[header]);
        });
        res.json(response.data);
    } catch (e: AxiosError | any) {
        try {
            res.status(e.response?.status || 500).json({});
        } catch (err: any) {
            console.error('Error forwarding request:', e.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export const proxy = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestBody = req.body;
        const url = req.originalUrl.replace('/api', '');
        // Make the request
        const response: AxiosResponse = await axios({
            method: req.method as any,
            url: `${API_URL}${url}`,
            headers: req.headers,
            data: requestBody,
        });

        // Set the headers from the remote API in the response
        const headers = response.headers;
        Object.keys(headers).forEach(header => {
            res.setHeader(header, headers[header]);
        });
        res.json(response.data);
    } catch (e: AxiosError | any) {
        try {
            res.status(e.response?.status || 500).json({});
        } catch (err: any) {
            console.error('Error forwarding request:', e.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export const getIcon = async (req: Request, res: Response): Promise<void> => {
    try {
        const filePath = req.params.filePath;
        const response: AxiosResponse = await axios.get(`${API_URL}/icon/${filePath}`, { responseType: 'arraybuffer' });
        // Forward the headers from the remote API
        const headers = response.headers;
        Object.keys(headers).forEach(header => {
            res.setHeader(header, headers[header]);
        });
        // Send the image content in the response
        res.send(Buffer.from(response.data, 'binary'));
    } catch (e: AxiosError | any) {
        try {
            res.status(e.response.status).json({});
        }
        catch (err: any) {
            console.error('Error fetching data from the API:', e.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}