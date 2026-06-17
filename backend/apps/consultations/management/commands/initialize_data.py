"""
Management command to initialize the database with sample data
Usage: python manage.py initialize_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from apps.accounts.models import CustomUser
from apps.horoscopes.models import ZodiacSign, Horoscope
from apps.blog.models import BlogCategory, BlogPost
from apps.testimonials.models import Testimonial


class Command(BaseCommand):
    help = 'Initialize database with sample data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting data initialization...'))

        # Create zodiac signs
        self.create_zodiac_signs()

        # Create blog categories
        self.create_blog_categories()

        # Create sample horoscopes
        self.create_sample_horoscopes()

        # Create sample blog posts
        self.create_sample_blog_posts()

        # Create sample testimonials
        self.create_sample_testimonials()

        self.stdout.write(self.style.SUCCESS('Data initialization completed!'))

    def create_zodiac_signs(self):
        """Create all 12 zodiac signs"""
        zodiac_data = [
            {
                'name': 'Aries',
                'symbol': '♈',
                'date_range': 'Mar 21 - Apr 19',
                'element': 'fire',
                'ruling_planet': 'Mars',
                'lucky_number': 9,
                'lucky_color': 'Red',
                'description': 'The Bold Pioneer - Courageous, determined, and passionate.',
            },
            {
                'name': 'Taurus',
                'symbol': '♉',
                'date_range': 'Apr 20 - May 20',
                'element': 'earth',
                'ruling_planet': 'Venus',
                'lucky_number': 6,
                'lucky_color': 'Green',
                'description': 'The Steady Builder - Reliable, grounded, and sensual.',
            },
            {
                'name': 'Gemini',
                'symbol': '♊',
                'date_range': 'May 21 - Jun 20',
                'element': 'air',
                'ruling_planet': 'Mercury',
                'lucky_number': 5,
                'lucky_color': 'Yellow',
                'description': 'The Curious Communicator - Adaptable, witty, and intellectual.',
            },
            {
                'name': 'Cancer',
                'symbol': '♋',
                'date_range': 'Jun 21 - Jul 22',
                'element': 'water',
                'ruling_planet': 'Moon',
                'lucky_number': 2,
                'lucky_color': 'Silver',
                'description': 'The Nurturing Protector - Intuitive, caring, and protective.',
            },
            {
                'name': 'Leo',
                'symbol': '♌',
                'date_range': 'Jul 23 - Aug 22',
                'element': 'fire',
                'ruling_planet': 'Sun',
                'lucky_number': 1,
                'lucky_color': 'Gold',
                'description': 'The Radiant Leader - Charismatic, generous, and confident.',
            },
            {
                'name': 'Virgo',
                'symbol': '♍',
                'date_range': 'Aug 23 - Sep 22',
                'element': 'earth',
                'ruling_planet': 'Mercury',
                'lucky_number': 5,
                'lucky_color': 'Navy',
                'description': 'The Practical Analyst - Analytical, methodical, and helpful.',
            },
            {
                'name': 'Libra',
                'symbol': '♎',
                'date_range': 'Sep 23 - Oct 22',
                'element': 'air',
                'ruling_planet': 'Venus',
                'lucky_number': 6,
                'lucky_color': 'Blue',
                'description': 'The Harmonious Diplomat - Fair-minded, social, and charming.',
            },
            {
                'name': 'Scorpio',
                'symbol': '♏',
                'date_range': 'Oct 23 - Nov 21',
                'element': 'water',
                'ruling_planet': 'Pluto',
                'lucky_number': 8,
                'lucky_color': 'Black',
                'description': 'The Intense Transformer - Mysterious, powerful, and passionate.',
            },
            {
                'name': 'Sagittarius',
                'symbol': '♐',
                'date_range': 'Nov 22 - Dec 21',
                'element': 'fire',
                'ruling_planet': 'Jupiter',
                'lucky_number': 3,
                'lucky_color': 'Purple',
                'description': 'The Adventurous Explorer - Optimistic, freedom-loving, and philosophical.',
            },
            {
                'name': 'Capricorn',
                'symbol': '♑',
                'date_range': 'Dec 22 - Jan 19',
                'element': 'earth',
                'ruling_planet': 'Saturn',
                'lucky_number': 8,
                'lucky_color': 'Brown',
                'description': 'The Ambitious Achiever - Disciplined, responsible, and practical.',
            },
            {
                'name': 'Aquarius',
                'symbol': '♒',
                'date_range': 'Jan 20 - Feb 18',
                'element': 'air',
                'ruling_planet': 'Uranus',
                'lucky_number': 4,
                'lucky_color': 'Turquoise',
                'description': 'The Visionary Innovator - Progressive, original, and humanitarian.',
            },
            {
                'name': 'Pisces',
                'symbol': '♓',
                'date_range': 'Feb 19 - Mar 20',
                'element': 'water',
                'ruling_planet': 'Neptune',
                'lucky_number': 7,
                'lucky_color': 'Seafoam',
                'description': 'The Dreamy Healer - Intuitive, artistic, and compassionate.',
            },
        ]

        for data in zodiac_data:
            zodiac, created = ZodiacSign.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            if created:
                self.stdout.write(f'Created zodiac sign: {data["name"]}')

    def create_blog_categories(self):
        """Create blog categories"""
        categories = [
            {'name': 'Education', 'slug': 'education', 'description': 'Learn astrology basics and deeper concepts'},
            {'name': 'Cosmic Events', 'slug': 'cosmic-events', 'description': 'Information about eclipses, retrograde, and cosmic phenomena'},
            {'name': 'Vedic Wisdom', 'slug': 'vedic-wisdom', 'description': 'Ancient wisdom from Vedic texts'},
            {'name': 'Career', 'slug': 'career', 'description': 'Career guidance and professional growth'},
            {'name': 'Relationships', 'slug': 'relationships', 'description': 'Relationship and compatibility insights'},
        ]

        for cat_data in categories:
            category, created = BlogCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'Created blog category: {cat_data["name"]}')

    def create_sample_horoscopes(self):
        """Create sample horoscopes"""
        zodiac_signs = ZodiacSign.objects.all()
        today = timezone.now().date()

        for sign in zodiac_signs[:3]:  # Create for first 3 signs
            horoscope, created = Horoscope.objects.get_or_create(
                zodiac_sign=sign,
                date=today,
                horoscope_type='daily',
                defaults={
                    'prediction': f'The stars are aligned favorably for {sign.name} today. Embrace new opportunities with confidence.',
                    'mood': 'Optimistic',
                    'lucky_numbers': '3, 7, 11',
                    'lucky_color': sign.lucky_color,
                    'lucky_day': 'Friday',
                    'love': 8,
                    'money': 7,
                    'health': 8,
                    'career': 9,
                    'family': 7,
                    'advice': 'Trust your instincts today.',
                    'caution': 'Avoid hasty decisions.',
                }
            )
            if created:
                self.stdout.write(f'Created horoscope for {sign.name}')

    def create_sample_blog_posts(self):
        """Create sample blog posts"""
        # Get or create admin user
        admin_user, _ = CustomUser.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@astroanu.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )

        education_category = BlogCategory.objects.get(slug='education')

        posts = [
            {
                'title': 'Understanding Your Birth Chart: A Beginner\'s Guide',
                'slug': 'understanding-birth-chart',
                'excerpt': 'Discover the foundations of Vedic astrology and how to interpret your cosmic blueprint.',
                'content': 'Your birth chart is a cosmic map created at the exact moment you were born...',
            },
            {
                'title': 'Mercury Retrograde: Myths and Realities',
                'slug': 'mercury-retrograde-guide',
                'excerpt': 'Explore the truth behind Mercury retrograde and navigate this cosmic phenomenon.',
                'content': 'Mercury retrograde often gets a bad reputation, but here\'s what you need to know...',
            },
        ]

        for post_data in posts:
            post, created = BlogPost.objects.get_or_create(
                slug=post_data['slug'],
                defaults={
                    **post_data,
                    'category': education_category,
                    'author': admin_user,
                    'is_published': True,
                    'publish_date': timezone.now(),
                    'read_time': 8,
                }
            )
            if created:
                self.stdout.write(f'Created blog post: {post_data["title"]}')

    def create_sample_testimonials(self):
        """Create sample testimonials"""
        # Get or create test user
        test_user, created = CustomUser.objects.get_or_create(
            email='testimonial@example.com',
            defaults={
                'username': 'testimonial_user',
                'first_name': 'Sample',
                'last_name': 'User',
            }
        )

        testimonials_data = [
            {
                'title': 'Life-Changing Insights',
                'content': 'Astro Anu provided me with incredible insights that helped me make important life decisions.',
                'rating': 5,
            },
            {
                'title': 'Highly Recommended',
                'content': 'The consultation was thorough and the astrologer was very knowledgeable.',
                'rating': 5,
            },
        ]

        for test_data in testimonials_data:
            testimonial, created = Testimonial.objects.get_or_create(
                user=test_user,
                title=test_data['title'],
                defaults={
                    **test_data,
                    'is_approved': True,
                    'featured': True,
                }
            )
            if created:
                self.stdout.write(f'Created testimonial: {test_data["title"]}')
