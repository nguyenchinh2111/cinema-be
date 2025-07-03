# Cinema Backend API Authentication

This NestJS application now includes JWT-based authentication for all API endpoints.

## Authentication Setup

### Default Users

- **Admin User**:
  - Username: `admin`
  - Password: `admin123`
  - Role: `admin`

- **Regular User**:
  - Username: `user`
  - Password: `user123`
  - Role: `user`

### How to Use

1. **Login to get JWT token**:

   ```bash
   POST /api/auth/login
   Content-Type: application/json

   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Response will include access token**:

   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "username": "admin",
       "email": "admin@cinema.com",
       "role": "admin"
     }
   }
   ```

3. **Use the token for protected endpoints**:
   ```bash
   GET /api/movies
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Protected Endpoints

All the following endpoints now require JWT authentication:

- **Movies**: `/api/movies/*`
- **Rooms**: `/api/rooms/*`
- **Showtimes**: `/api/showtimes/*`
- **Tickets**: `/api/tickets/*`
- **Vouchers**: `/api/vouchers/*`
- **Events**: `/api/events/*`

### Swagger Documentation

Access the interactive API documentation at: `http://localhost:4000/api-docs`

The Swagger UI includes:

- JWT Bearer token authentication
- All endpoints with authentication requirements
- Interactive testing with authentication

### Testing Authentication

1. Go to `http://localhost:4000/api-docs`
2. Click "Authorize" button
3. Login using `/api/auth/login` endpoint
4. Copy the `access_token` from the response
5. Click "Authorize" again and paste the token with "Bearer " prefix
6. Now you can test all protected endpoints

### Environment Variables

Set the following environment variable for security:

```bash
JWT_SECRET=your-super-secret-jwt-key
```

If not set, it will use a default key (not recommended for production).

## Starting the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

The application will be available at `http://localhost:4000`
The Swagger documentation will be available at `http://localhost:4000/api-docs`
