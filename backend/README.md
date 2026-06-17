# Astro Anu - Django Backend

Professional Django REST API backend for the Vedic Astrology website.

## Features

- User authentication and profile management
- Consultation booking system with payment integration
- Blog management with comments
- Horoscope generation and management
- Cosmic events tracking
- Testimonials management
- Admin dashboard
- Comprehensive API documentation

## Technology Stack

- **Framework**: Django 4.2.11
- **REST API**: Django REST Framework 3.14.0
- **Authentication**: JWT (Simple JWT)
- **Database**: PostgreSQL (production) / SQLite (development)
- **Task Queue**: Celery
- **Cache**: Redis
- **Web Server**: Gunicorn + Nginx
- **Containerization**: Docker

## Project Structure

```
backend/
├── astro_anu/           # Main Django project
│   ├── settings.py      # Settings
│   ├── urls.py          # Main URL routing
│   ├── wsgi.py          # WSGI application
│   ├── asgi.py          # ASGI application
│   └── celery.py        # Celery configuration
├── apps/
│   ├── accounts/        # User management
│   ├── consultations/   # Consultation booking
│   ├── blog/           # Blog management
│   ├── horoscopes/     # Horoscope data
│   └── testimonials/   # Client testimonials
├── manage.py           # Django management command
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
├── Dockerfile         # Docker image configuration
├── docker-compose.yml # Docker services configuration
└── README.md         # This file
```

## Installation

### Prerequisites

- Python 3.11+
- PostgreSQL 13+
- Redis 6+
- Git

### Local Development Setup

#### Windows

```bash
cd backend
setup.bat
```

#### Linux/Mac

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate.bat
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Collect static files**:
   ```bash
   python manage.py collectstatic
   ```

7. **Run development server**:
   ```bash
   python manage.py runserver
   ```

## Docker Setup

### Using Docker Compose

```bash
cd backend
docker-compose up -d
```

This will start:
- Django backend (http://localhost:8000)
- PostgreSQL database
- Redis cache
- Nginx reverse proxy (http://localhost:80)
- Celery worker

### Access Services

- **API**: http://localhost:8000/api/
- **Admin**: http://localhost:8000/admin/
- **Nginx**: http://localhost:80/

## API Endpoints

### Authentication

- `POST /api/accounts/auth/signup/` - Register new user
- `POST /api/accounts/auth/login/` - Login user
- `POST /api/accounts/auth/logout/` - Logout user
- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh JWT token

### Users

- `GET /api/accounts/users/me/` - Get current user profile
- `PUT /api/accounts/users/update_profile/` - Update user profile
- `POST /api/accounts/users/change_password/` - Change password
- `POST /api/accounts/users/request_password_reset/` - Request password reset
- `POST /api/accounts/users/reset_password/` - Reset password

### Consultations

- `GET /api/consultations/` - List user consultations
- `POST /api/consultations/` - Create new consultation
- `GET /api/consultations/{id}/` - Get consultation details
- `POST /api/consultations/{id}/submit_feedback/` - Submit feedback
- `POST /api/consultations/{id}/process_payment/` - Process payment

### Blog

- `GET /api/blog/posts/` - List blog posts
- `POST /api/blog/posts/` - Create blog post (admin)
- `GET /api/blog/posts/{id}/` - Get blog post details
- `POST /api/blog/posts/{id}/add_comment/` - Add comment
- `GET /api/blog/posts/featured/` - Get featured posts
- `GET /api/blog/posts/latest/` - Get latest posts
- `GET /api/blog/categories/` - List blog categories

### Horoscopes

- `GET /api/horoscopes/zodiac-signs/` - List zodiac signs
- `GET /api/horoscopes/horoscopes/` - List horoscopes
- `GET /api/horoscopes/horoscopes/today/` - Get today's horoscopes
- `GET /api/horoscopes/horoscopes/by_sign/?sign=Aries` - Get horoscope for sign
- `GET /api/horoscopes/horoscopes/weekly/` - Get weekly horoscopes
- `GET /api/horoscopes/cosmic-events/` - List cosmic events
- `GET /api/horoscopes/cosmic-events/upcoming/` - Get upcoming cosmic events

### Testimonials

- `GET /api/testimonials/` - List approved testimonials
- `POST /api/testimonials/` - Create testimonial
- `GET /api/testimonials/featured/` - Get featured testimonials
- `GET /api/testimonials/top_rated/` - Get top rated testimonials
- `GET /api/testimonials/stats/` - Get testimonials statistics

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Django
DEBUG=False
SECRET_KEY=your-super-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=astro_anu_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Frontend
FRONTEND_URL=http://localhost:5173,http://localhost:3000

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_EXPIRATION_HOURS=24

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Stripe (Optional)
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Redis
REDIS_URL=redis://localhost:6379/0

# Consultation
CONSULTATION_FEE=99.99
```

## Celery Configuration

Start Celery worker:

```bash
celery -A astro_anu worker -l info
```

Start Celery beat scheduler:

```bash
celery -A astro_anu beat -l info
```

## Admin Panel

Access Django admin at: http://localhost:8000/admin/

- Manage users
- Create blog posts
- Manage horoscopes
- Manage cosmic events
- Approve testimonials
- Track consultations
- View analytics

## Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure proper database (PostgreSQL)
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up email service
- [ ] Configure static file serving (S3 or CDN)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all APIs

### Heroku Deployment

```bash
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:standard-0
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### DigitalOcean/AWS Deployment

See deployment guides in the `docs/deployment/` directory.

## Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.accounts

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## API Documentation

Full API documentation is available at:
- Swagger UI: http://localhost:8000/api/schema/swagger/
- ReDoc: http://localhost:8000/api/schema/redoc/

## Troubleshooting

### Database Connection Error

- Ensure PostgreSQL is running
- Check database credentials in .env
- Run `python manage.py migrate` to create tables

### Static Files Not Loading

- Run `python manage.py collectstatic --noinput`
- Check `STATIC_ROOT` path

### CORS Errors

- Verify `FRONTEND_URL` in .env
- Check `CORS_ALLOWED_ORIGINS` in settings

### Email Not Sending

- Configure email credentials in .env
- Check email backend configuration
- Test SMTP connection

## Support

For issues and support, contact: support@astroanu.com

## License

Copyright © 2024 Astro Anu. All rights reserved.
