#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Checking superuser environment variables..."
echo "DJANGO_SUPERUSER_USERNAME set? ${DJANGO_SUPERUSER_USERNAME:+yes}"
echo "DJANGO_SUPERUSER_EMAIL set? ${DJANGO_SUPERUSER_EMAIL:+yes}"
echo "DJANGO_SUPERUSER_PASSWORD set? ${DJANGO_SUPERUSER_PASSWORD:+yes}"

echo "Creating superuser if environment variables are present..."
python manage.py shell << END
import os
from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if username and email and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print("Superuser created successfully.")
    else:
        print("Superuser already exists. Skipping creation.")
else:
    print("Superuser environment variables not set. Skipping.")
END
