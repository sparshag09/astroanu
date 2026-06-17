##!/usr/bin/env bash
#set -o errexit

#pip install -r requirements.txt
#python manage.py collectstatic --no-input
#python manage.py migrate
#!/usr/bin/env bash
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create superuser ONLY if the environment variable is set
# This prevents errors on subsequent builds if you remove the env var later
if [[ -n "$DJANGO_SUPERUSER_USERNAME" ]]; then
  python manage.py createsuperuser --no-input
fi

# Migrate database and collect static files
python manage.py migrate
python manage.py collectstatic --no-input   
