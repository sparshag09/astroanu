# AstroAnu — Premium Vedic Astrology Website
Full-stack: **React 18 + TypeScript + Vite** frontend  |  **Django 5 + DRF** backend

---

## Quick Start (2 terminals)

### Terminal 1 — Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # choose any email + password
python manage.py runserver        # → http://localhost:8000
```
Admin panel → **http://localhost:8000/admin**

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev                        # → http://localhost:5173
```

---

## What's Integrated

| Feature | Frontend calls | Backend endpoint |
|---|---|---|
| Register | `authUtils.register()` | `POST /api/accounts/auth/signup/` |
| Login | `authUtils.login()` | `POST /api/accounts/auth/login/` |
| Logout | `authUtils.logout()` | `POST /api/accounts/auth/logout/` |
| Update profile | `authUtils.updateUserProfile()` | `PUT /api/accounts/users/update_profile/` |
| Horoscope by sign | `horoscopesAPI.getHoroscopeBySign()` | `GET /api/horoscopes/horoscopes/by_sign/?sign=Aries` |
| Blog posts | `blogAPI.getPosts()` | `GET /api/blog/posts/` |
| Blog categories | `blogAPI.getCategories()` | `GET /api/blog/categories/` |
| Testimonials | `testimonialsAPI.getFeatured()` | `GET /api/testimonials/featured/` |
| Book consultation | `consultationsAPI.create()` | `POST /api/consultations/` |
| My consultations | `consultationsAPI.getMyConsultations()` | `GET /api/consultations/my_consultations/` |

All pages gracefully **fall back to local data** if the backend is unreachable.

---

## Admin Panel — All 13 Models Registered
- **Accounts**: CustomUser, UserVerificationToken, PasswordResetToken
- **Consultations**: Consultation (full fieldsets, date hierarchy), ConsultationFeedback
- **Blog**: BlogPost (inline publish toggle), BlogCategory, BlogComment (inline approve)
- **Horoscopes**: ZodiacSign, Horoscope (aspect ratings), CosmicEvent
- **Testimonials**: Testimonial (inline approve + feature toggles)

---

## Seed Zodiac Signs (run once after migrate)
```bash
cd backend
python manage.py shell << 'PYEOF'
from apps.horoscopes.models import ZodiacSign
signs = [
  ('Aries','♈','Mar 21 - Apr 19','fire','Mars',9,'Red','Bold and pioneering'),
  ('Taurus','♉','Apr 20 - May 20','earth','Venus',6,'Green','Stable and sensual'),
  ('Gemini','♊','May 21 - Jun 20','air','Mercury',5,'Yellow','Curious and adaptable'),
  ('Cancer','♋','Jun 21 - Jul 22','water','Moon',2,'Silver','Nurturing and intuitive'),
  ('Leo','♌','Jul 23 - Aug 22','fire','Sun',1,'Gold','Proud and generous'),
  ('Virgo','♍','Aug 23 - Sep 22','earth','Mercury',6,'Brown','Analytical and precise'),
  ('Libra','♎','Sep 23 - Oct 22','air','Venus',6,'Pink','Balanced and just'),
  ('Scorpio','♏','Oct 23 - Nov 21','water','Mars',8,'Black','Intense and transformative'),
  ('Sagittarius','♐','Nov 22 - Dec 21','fire','Jupiter',3,'Purple','Adventurous and free'),
  ('Capricorn','♑','Dec 22 - Jan 19','earth','Saturn',8,'Dark Brown','Disciplined and ambitious'),
  ('Aquarius','♒','Jan 20 - Feb 18','air','Saturn',11,'Blue','Innovative and humanitarian'),
  ('Pisces','♓','Feb 19 - Mar 20','water','Jupiter',7,'Sea Green','Dreamy and compassionate'),
]
for name,sym,dates,elem,planet,num,color,desc in signs:
    ZodiacSign.objects.get_or_create(name=name, defaults=dict(symbol=sym,date_range=dates,element=elem,ruling_planet=planet,lucky_number=num,lucky_color=color,description=desc))
print('12 zodiac signs created!')
PYEOF
```

---

## Project Structure
```
AstroAnu/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/       Home, Login, Signup, Horoscopes, Blog,
│   │   │   │                Testimonials, Consultation, Profile
│   │   │   ├── components/  Navbar, ProtectedRoute, UI kit, decorative
│   │   │   ├── utils/       auth.ts  ← all API calls live here
│   │   │   └── types/
│   │   ├── services/
│   │   │   └── api.ts       ← central API service (JWT auto-refresh)
│   │   └── styles/
│   ├── .env.development
│   └── package.json
│
└── backend/
    ├── apps/
    │   ├── accounts/        CustomUser JWT auth
    │   ├── blog/            Posts, Categories, Comments
    │   ├── consultations/   Booking + feedback
    │   ├── horoscopes/      ZodiacSign, Horoscope, CosmicEvent
    │   └── testimonials/    Moderated testimonials
    ├── astro_anu/           settings, urls, admin site title
    ├── .env                 ← edit this for production
    ├── manage.py
    └── requirements.txt
```
