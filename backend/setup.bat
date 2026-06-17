@echo off
REM Astro Anu Backend Setup Script for Windows

echo =========================================
echo Astro Anu Backend Setup
echo =========================================

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Create .env file
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Please update .env file with your configuration
)

REM Run migrations
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser
echo Creating superuser...
python manage.py createsuperuser

REM Collect static files
echo Collecting static files...
python manage.py collectstatic --noinput

echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo To start the development server, run:
echo     python manage.py runserver
echo.
echo To access the admin panel, go to:
echo     http://localhost:8000/admin/
echo.
pause
