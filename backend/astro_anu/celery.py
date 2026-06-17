"""
Celery configuration for astro_anu project.
"""
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'astro_anu.settings')

app = Celery('astro_anu')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
