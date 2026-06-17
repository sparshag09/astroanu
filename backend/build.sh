##!/usr/bin/env bash
#set -o errexit

#pip install -r requirements.txt
#python manage.py collectstatic --no-input
#python manage.py migrate
#!/usr/bin/env bash
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create superuser non-interactively using environment variables
python manage.py createsuperuser --no-input \
  --username "$DJANGO_SUPERUSER_USERNAME" \
  --email "$DJANGO_SUPERUSER_EMAIL" \
  --password "$DJANGO_SUPERUSER_PASSWORD"

# Migrate database and collect static files
python manage.py migrate
python manage.py collectstatic --no-input   
