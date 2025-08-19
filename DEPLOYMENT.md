# DealFinder Deployment Guide

This guide will help you deploy the DealFinder application to production.

## Prerequisites

- Node.js 18+ installed on your server
- MongoDB database (local or cloud)
- Domain name (optional)
- SSL certificate (recommended)

## Deployment Options

### Option 1: Traditional VPS/Server

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dealfinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with production values
   ```

4. **Build the frontend**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   # For development
   npm run dev
   
   # For production
   cd server && npm start
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   RUN npm run build
   
   EXPOSE 5000
   
   CMD ["npm", "run", "dev"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - MONGO_URI=mongodb://mongo:27017/dealfinder
       depends_on:
         - mongo
     
     mongo:
       image: mongo:latest
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
   
   volumes:
     mongo_data:
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

### Option 3: Cloud Platforms

#### Heroku

1. **Create Procfile**
   ```
   web: cd server && npm start
   ```

2. **Set environment variables in Heroku dashboard**

3. **Deploy**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

#### Vercel

1. **Create vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "server/server.js"
       }
     ]
   }
   ```

2. **Deploy**
   ```bash
   vercel
   ```

## Environment Variables for Production

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dealfinder
JWT_SECRET=your-super-secure-jwt-secret-key
NODE_ENV=production
```

## Security Considerations

1. **JWT Secret**: Use a strong, random secret key
2. **MongoDB**: Use connection string with authentication
3. **CORS**: Configure for your domain only
4. **Rate Limiting**: Implement API rate limiting
5. **HTTPS**: Always use HTTPS in production

## Performance Optimization

1. **Enable compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching headers**
   ```javascript
   app.use(express.static('client', {
     maxAge: '1y',
     etag: true
   }));
   ```

3. **Database indexing**
   ```javascript
   // Add indexes to your MongoDB collections
   db.users.createIndex({ "username": 1 });
   ```

## Monitoring

1. **Health checks**
   - Endpoint: `/health`
   - Monitor MongoDB connection
   - Check API response times

2. **Logging**
   ```javascript
   const morgan = require('morgan');
   app.use(morgan('combined'));
   ```

3. **Error tracking**
   - Consider using Sentry or similar service

## Backup Strategy

1. **Database backups**
   ```bash
   mongodump --uri="mongodb://localhost:27017/dealfinder"
   ```

2. **Application backups**
   - Version control with Git
   - Regular backups of environment files

## Troubleshooting

### Common Issues

1. **MongoDB Connection**
   - Check connection string
   - Verify network access
   - Check authentication credentials

2. **Port Issues**
   - Ensure port 5000 is available
   - Check firewall settings

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Logs

Check application logs for errors:
```bash
# If using PM2
pm2 logs

# If using Docker
docker-compose logs

# If using systemd
journalctl -u your-app-service
```

## Support

For deployment issues, check:
1. Application logs
2. MongoDB connection status
3. Environment variables
4. Network connectivity
5. Port availability
