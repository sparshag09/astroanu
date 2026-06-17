# Complete Setup & Deployment Guide

## Project Structure

```
Premium Vedic Astrology Website/
├── backend/                 # Django Backend
│   ├── astro_anu/          # Main Django project
│   ├── apps/               # Django applications
│   ├── manage.py           # Django management command
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   ├── docker-compose.yml  # Docker services
│   └── README.md          # Backend documentation
│
├── src/                     # React Frontend
│   ├── app/               # React application
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration
│   └── styles/            # Stylesheets
│
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite configuration
└── index.html            # HTML entry point
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 13+
- Redis 6+
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Setup using provided scripts**:
   
   **Windows**:
   ```bash
   setup.bat
   ```
   
   **Linux/Mac**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Or manual setup**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env.development
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - Admin: http://localhost:8000/admin

## Docker Setup

### Using Docker Compose

1. **From root directory**:
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Access services**:
   - API: http://localhost:8000/api
   - Admin: http://localhost:8000/admin
   - Frontend proxy: http://localhost:80

3. **Run migrations in Docker**:
   ```bash
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py createsuperuser
   ```

### Services in Docker Compose

- **backend**: Django REST API (port 8000)
- **db**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)
- **celery**: Celery task worker
- **nginx**: Nginx reverse proxy (port 80)

## Configuration

### Backend (.env)

```env
# Django
DEBUG=False
SECRET_KEY=your-super-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=astro_anu_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Frontend URLs (CORS)
FRONTEND_URL=http://localhost:5173,https://yourdomain.com

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_EXPIRATION_HOURS=24

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Stripe
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Consultation Fee
CONSULTATION_FEE=99.99
```

### Frontend (.env.development / .env.production)

```env
# API
VITE_API_URL=http://localhost:8000/api

# Features
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_EMAIL_VERIFICATION=true
```

## Available Scripts

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

### Backend

```bash
python manage.py runserver          # Start development server
python manage.py migrate            # Run migrations
python manage.py createsuperuser    # Create admin user
python manage.py collectstatic      # Collect static files
celery -A astro_anu worker -l info  # Start Celery worker
```

## API Documentation

### Authentication Endpoints

- `POST /api/accounts/auth/signup/` - Register new user
- `POST /api/accounts/auth/login/` - Login user
- `POST /api/accounts/auth/logout/` - Logout
- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh JWT token

### Core Endpoints

- `GET /api/accounts/users/me/` - Get current user
- `PUT /api/accounts/users/update_profile/` - Update profile
- `GET /api/consultations/` - List consultations
- `POST /api/consultations/` - Create consultation
- `GET /api/blog/posts/` - List blog posts
- `GET /api/horoscopes/zodiac-signs/` - Get zodiac signs
- `GET /api/horoscopes/horoscopes/today/` - Today's horoscopes
- `GET /api/testimonials/` - List testimonials

See full API documentation in `backend/README.md`

## Deployment

### Local Deployment

1. **Backend**:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Frontend**:
   ```bash
   npm run dev
   ```

### Production Deployment

#### Option 1: Docker (Recommended)

```bash
cd backend
docker-compose -f docker-compose.yml up -d
```

#### Option 2: Manual Deployment

**Backend**:
```bash
cd backend
gunicorn --bind 0.0.0.0:8000 --workers 4 astro_anu.wsgi:application
```

**Frontend**:
```bash
npm run build
npm run preview
# Or serve with nginx
```

### Cloud Deployment

#### Heroku

```bash
# Backend
cd backend
git push heroku main

# Frontend
heroku config:set VITE_API_URL=https://your-heroku-app.herokuapp.com/api
npm run build
# Deploy to Netlify or Vercel
```

#### DigitalOcean

See `docs/deployment/digitalocean.md`

#### AWS

See `docs/deployment/aws.md`

## Testing

### Backend

```bash
cd backend
python manage.py test
python manage.py test apps.accounts
coverage run --source='.' manage.py test
```

### Frontend

```bash
npm run test
npm run test:coverage
```

## Troubleshooting

### CORS Errors

**Problem**: API returns CORS error

**Solution**:
1. Check `FRONTEND_URL` in backend `.env`
2. Verify `VITE_API_URL` in frontend `.env`
3. Restart both servers

### Database Connection Error

**Problem**: Can't connect to PostgreSQL

**Solution**:
1. Ensure PostgreSQL is running
2. Check credentials in `.env`
3. Run migrations: `python manage.py migrate`

### Port Already in Use

**Solution**:
```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Static Files Not Loading

**Solution**:
```bash
cd backend
python manage.py collectstatic --noinput
```

### Email Not Sending

**Solution**:
1. Verify SMTP credentials in `.env`
2. Check email service configuration
3. Test SMTP connection

## Performance Optimization

### Backend

- Enable caching with Redis
- Use database indexing
- Optimize database queries
- Implement pagination
- Use CDN for static files

### Frontend

- Code splitting
- Lazy loading
- Image optimization
- Minification
- Compression

## Security

### Backend

- Set `DEBUG=False` in production
- Use strong `SECRET_KEY`
- Enable HTTPS
- Set secure CORS origins
- Implement rate limiting
- Use environment variables for secrets

### Frontend

- Never commit `.env` files
- Sanitize user input
- Use HTTPS in production
- Implement CSRF protection
- Keep dependencies updated

## Monitoring & Logging

### Backend

- Enable Django logging
- Set up error tracking (Sentry)
- Monitor database performance
- Track API usage

### Frontend

- Set up error tracking
- Monitor performance
- Track user analytics

## Maintenance

### Backup Strategy

```bash
# Database backup
pg_dump astro_anu_db > backup_$(date +%Y%m%d).sql

# Media files backup
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/
```

### Updating Dependencies

```bash
# Backend
pip list --outdated
pip install --upgrade <package>

# Frontend
npm outdated
npm update
```

## Support & Documentation

- Backend docs: See `backend/README.md`
- API documentation: http://localhost:8000/api/schema/
- Frontend docs: See source code comments

## License

© 2024 Astro Anu. All rights reserved.
