import cors from 'cors';

const corsMiddleware = cors({
  origin: function (origin: string | undefined, callback: (error: Error | null, allow: boolean) => void) {  
    if (!origin || /http:\/\/localhost(:\d+)?/.test(origin) || /http:\/\/\d+\.\d+\.\d+\.\d+:\d+/.test(origin)) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'), false); 
    }
  },
  methods: ['GET', 'POST', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
});

export default corsMiddleware;
