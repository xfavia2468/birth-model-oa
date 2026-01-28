Project is set up with a Django REST framework backend and a js Vite React frontend.

Backend Setup (from project root):
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
        (api endpoints at... none yet)

    !! React dev server uses proxy in vite.config.js to forward /api requests to Django backend.
    !! If you change the backend port, the proxy in frontend/vite.config.js must be changed.

Frontend Setup: 
    1. Install node
        cd frontend
        npm install

    2. Run Frontend Server
        (http://localhost:5173/)
