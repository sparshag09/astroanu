"""
ASGI config for astro_anu project.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'astro_anu.settings')
application = get_asgi_application()
