# Anycomp Backend API

Professional-grade REST API for the Anycomp platform built with Node.js, Express, TypeORM, and PostgreSQL.

## 🏗️ Architecture Overview

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL 14+
- **Validation**: Zod
- **Security**: JWT, bcryptjs, Helmet
- **Logging**: Morgan
- **Language**: TypeScript

### Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app initialization
│   ├── server.ts              # Server startup & error handling
│   ├── config/
│   │   ├── database.ts        # TypeORM DataSource configuration
│   │   └── env.ts             # Environment variable validation (Zod)
│   ├── entities/              # TypeORM entity definitions
│   │   ├── Specialist.entity.ts
│   │   ├── ServiceOffering.entity.ts
│   │   ├── PlatformFee.entity.ts
│   │   └── Media.entity.ts
│   ├── dtos/                  # Data Transfer Objects & validation schemas
│   │   ├── specialist.dto.ts
│   │   ├── query.dto.ts
│   │   └── service.dto.ts
│   ├── controllers/           # Request handlers
│   │   └── specialist.controller.ts
│   ├── services/              # Business logic layer
│   │   └── specialist.service.ts
│   ├── routes/                # API route definitions
│   │   ├── index.ts
│   │   └── specialist.routes.ts
│   ├── middlewares/           # Express middleware
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── utils/                 # Utility functions
│   │   ├── ApiResponse.ts     # Standardized API response wrapper
│   │   └── ApiError.ts        # Custom error class
│   ├── migrations/            # Database migrations (if needed)
│   ├── seeds/                 # Database seed data
│   └── types/                 # TypeScript type definitions
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- PostgreSQL 14+ ([download](https://www.postgresql.org/download/))
- npm or yarn
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd anycomp/backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

### 4. Edit `.env` File

```dotenv
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=anycomp_db
DB_SSL=false

# JWT Configuration (Optional)
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 5. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE anycomp_db;
```

### 6. Run Server

```bash
# Development with hot-reload
npm run dev

# Production build
npm run build
npm run start
```

Server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
Response: { status: 'ok', timestamp: '2024-01-15T...' }
```

---

## 🔌 API Endpoints

### Specialists

#### Get All Specialists (Admin)
```
GET /specialists
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - status: 'draft' | 'published' (optional)
  - search: string (optional) - searches by name
  - sortBy: 'created_at' | 'name' | 'updated_at' (default: 'created_at')
  - sortOrder: 'ASC' | 'DESC' (default: 'DESC')

Response:
{
  "success": true,
  "message": "Specialists retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get Public Specialists (Published Only)
```
GET /specialists/public
Query Parameters: Same as above (status automatically set to 'published')

Response: Same structure as above
```

#### Get Specialist by ID
```
GET /specialists/:id

Response:
{
  "success": true,
  "message": "Specialist retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Company Name",
    "description": "...",
    "status": "draft",
    "contact_email": "...",
    "contact_phone": "...",
    "website_url": "...",
    "logo_id": "uuid",
    "published_at": null,
    "created_at": "2024-01-15T...",
    "updated_at": "2024-01-15T...",
    "service_offerings": [...],
    "media": [...]
  }
}
```

#### Create Specialist
```
POST /specialists
Content-Type: application/json

Request Body:
{
  "name": "Specialist Inc.",
  "description": "Optional description",
  "contact_email": "contact@example.com",
  "contact_phone": "+1234567890",
  "website_url": "https://example.com",
  "logo_id": "optional-uuid",
  "service_offerings": [
    {
      "service_name": "Consulting",
      "service_type": "Strategic",
      "description": "...",
      "platform_fee_id": "optional-uuid"
    }
  ]
}

Response: Created specialist object with 201 status
```

#### Update Specialist
```
PUT /specialists/:id
Content-Type: application/json

Request Body: Same as Create (all fields optional)

Response: Updated specialist object
```

#### Publish Specialist
```
PATCH /specialists/:id/publish
Content-Type: application/json

Request Body:
{
  "status": "published"
}

Response: Updated specialist object with published_at timestamp
```

#### Delete Specialist
```
DELETE /specialists/:id

Response:
{
  "success": true,
  "message": "Specialist deleted successfully"
}
```

---

## 📊 Database Schema

### Tables

#### `specialists`
```sql
CREATE TABLE specialists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  contact_email VARCHAR(255) UNIQUE NOT NULL,
  contact_phone VARCHAR(50),
  website_url VARCHAR(500),
  logo_id UUID,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (logo_id) REFERENCES media(id),
  INDEX idx_specialists_status (status),
  INDEX idx_specialists_name (name)
);
```

#### `service_offerings`
```sql
CREATE TABLE service_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id UUID NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_type VARCHAR(100),
  description TEXT,
  platform_fee_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_fee_id) REFERENCES platform_fee(id) ON DELETE SET NULL,
  INDEX idx_service_specialist (specialist_id)
);
```

#### `platform_fee`
```sql
CREATE TABLE platform_fee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_name VARCHAR(100) NOT NULL,
  fee_percentage DECIMAL(5, 2),
  fee_fixed_amount DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `media`
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id UUID,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(1000) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER,
  media_type ENUM('logo', 'document', 'image') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON DELETE SET NULL,
  INDEX idx_media_specialist (specialist_id),
  INDEX idx_media_type (media_type)
);
```

### Relationships

```
specialists (1) ──────── (N) service_offerings
     │                         │
     │                         └──→ platform_fee (0..1)
     │
     └──────── (N) media

specialists.logo_id ──→ media.id
```

---

## 🛡️ Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "contact_email",
      "message": "Invalid email address",
      "code": "invalid_string"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request / Validation Error |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## ✅ Validation

All inputs are validated using **Zod** schemas. Validation errors return a 400 status with detailed error information.

### Example Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "contact_email",
      "message": "Invalid email address",
      "code": "invalid_email"
    },
    {
      "field": "name",
      "message": "Name is required",
      "code": "too_small"
    }
  ]
}
```

---

## 🔐 Security Features

- **Helmet.js**: Sets security HTTP headers
- **CORS**: Configurable cross-origin requests
- **Zod Validation**: Input sanitization & validation
- **UUID Primary Keys**: Prevents ID enumeration
- **Password Hashing**: bcryptjs for secure password storage
- **JWT**: Optional authentication for protected routes
- **Morgan**: Request logging for security auditing

---

## 📦 Available Scripts

```bash
# Development server with hot-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

---

## 🚀 Deployment

### Vercel (Node.js Support)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Traditional VPS / EC2

1. Install Node.js and PostgreSQL
2. Clone repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Set up systemd service:

```bash
[Unit]
Description=Anycomp API
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/home/node/anycomp/backend
ExecStart=/usr/bin/node dist/server.js
Restart=always
Environment="NODE_ENV=production"
EnvironmentFile=/home/node/anycomp/backend/.env

[Install]
WantedBy=multi-user.target
```

6. Enable and start: `sudo systemctl enable anycomp-api && sudo systemctl start anycomp-api`

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]
```

Build and run:
```bash
docker build -t anycomp-api .
docker run -p 5000:5000 --env-file .env anycomp-api
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# With coverage
npm run test:coverage
```

---

## 📝 Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code style enforcement
- **Prettier**: Code formatting
- **Meaningful naming**: Self-documenting code
- **No unused code**: Clean codebase

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

---

## 📄 License

Proprietary - Anycomp Platform

---

## 📞 Support

For issues or questions, contact the development team or submit an issue on the project repository.

---

## 🔄 Environment Variables Reference

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| NODE_ENV | string | No | development | Environment mode (development, production, test) |
| PORT | number | No | 5000 | Server port |
| DB_HOST | string | Yes | - | PostgreSQL host |
| DB_PORT | number | No | 5432 | PostgreSQL port |
| DB_USERNAME | string | Yes | - | PostgreSQL user |
| DB_PASSWORD | string | Yes | - | PostgreSQL password |
| DB_NAME | string | Yes | - | Database name |
| DB_SSL | boolean | No | false | Enable SSL for database |
| JWT_SECRET | string | No | - | Secret key for JWT signing |
| JWT_EXPIRES_IN | string | No | 7d | JWT token expiration |
| CORS_ORIGIN | string | No | http://localhost:3000 | Allowed CORS origins |

---

**Last Updated**: January 2024
**Version**: 1.0.0
# anycomp-backend
