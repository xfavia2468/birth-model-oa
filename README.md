Project is set up with a Django REST framework backend and a js Vite React frontend.

<h2>Backend Setup (from project root):</h2>

    1. Create/Activate the venv
        cd backend
        python3 -m venv venv
        source venv/bin/activate

    2. Install Dependencies
        pip install django djangorestframework django-cors-headers
        (don't have requirements.txt yet)

    3. DB Migrations
        python manage.py makemigrations
        python manage.py migrate

    4. Run Backend Server
        python manage.py runserver
        (http://127.0.0.1:8000/api/hello)

!! React dev server uses proxy in vite.config.js to forward /api requests to Django backend.

!! If you change the backend port, the proxy in frontend/vite.config.js must be changed.

<h2>Frontend Setup:</h2>

    1. Install node
        cd frontend
        npm install

    2. Run Frontend Server
        (http://localhost:5173/)

<h2>API Endpoints</h2>

| Action                                  | Method | Endpoint                          | Description                                                                 |
|----------------------------------------|--------|----------------------------------|-----------------------------------------------------------------------------|
| List all patients                        | GET    | `/api/patients/`                  | Returns all patients with nested medications                                |
| Create a new patient                      | POST   | `/api/patients/`                  | Create a patient and optionally include medications                         |
| Retrieve a patient                        | GET    | `/api/patients/<id>/`             | Get a single patient by ID, including medications                           |
| Full update                               | PUT    | `/api/patients/<id>/`             | Replace all patient fields and medications                                  |
| Partial update (keep previous meds)       | PATCH  | `/api/patients/<id>/`             | Update patient fields and add new medications without removing old ones     |
| Partial update (wipe previous meds)       | PATCH  | `/api/patients/<id>/?mode=wipe`  | Update patient fields and replace all medications with the new list         |
| Delete a patient                          | DELETE | `/api/patients/<id>/`             | Delete the patient and all their medications                                |

<h2>Database Seeding</h2>

I used [Faker](https://faker.readthedocs.io/en/master/) in `seed.py` to randomly seed the database with fake patient names, date of births, medications, etc.
It can be reseeded with `python backend/manage.py` from the root directory.
***(Script made by ChatGPT).***
