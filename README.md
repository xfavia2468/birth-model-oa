<h1>Patient Medication Timeline Tool</h1>

This web app lets users search through a database of patients by first name, last name, and/or date of birth.
Users can select a patient to view their medication timeline. The timeline sorts medications by their end date in descending order (most recently ended medications or ongoing medications at the top). The timeline includes information about each medication, including name, start date, end date, dosage, route, and prescriber. 

Missing information is explicitly labeled as "Unknown" rather than inferred, to avoid masking incomplete or conflicting records. The exception to this is the end date, which, if null, the medication is assumed to be ongoing. The timeline also highlights important information/contradictions: medications that are ongoing, when the dose/route/prescriber of a medication changes, or when there is a date/dose/route/prescriber conflict with the same medication.

<h3>Hosted on Render</h3>

Please note that due to the limitations of Render's free tier there may be some startup time for the backend. It may take ~30 seconds to respond on first load. Also, the SQLite file will reset every time the backend does, so do not count on the same patients always being accessible.

Frontend: https://birth-model-oa-1.onrender.com/ | Backend: https://birth-model-oa.onrender.com/api/patients/

<h1>Local Setup</h1>

Project is set up with a Django REST framework backend and a JS Vite React frontend.

<h2>Backend Setup (from project root):</h2>

    1. Create/Activate the venv
        cd backend
        python3 -m venv venv
        source venv/bin/activate

    2. Install Dependencies
        pip install -r requirements.txt

    3. DB Migrations
        python manage.py migrate

    4. Seed the Database
        python manage.py seed

    5. Run Backend Server
        python manage.py runserver
        (http://127.0.0.1:8000/)

<h2>Frontend Setup:</h2>

    1. Install Dependencies
        cd frontend
        npm install

    2. Create Frontend Environment File
        Create a file called `.env` in the frontend directory:
        Insert: VITE_API_URL=http://127.0.0.1:8000

    3. Run Frontend dev Server
        npm run dev
        (http://localhost:5173/)

<h2>API Endpoints</h2>

The two PATCH modes exist to explicitly model real-world ambiguity: some systems append records, while others overwrite historical data. However, I got ahead of myself when writing the backend and never ended up using the endpoints. Still, if this system were to be added onto, these would be very helpful.

| Action                                  | Method | Endpoint                          | Description                                                                 |
|----------------------------------------|--------|----------------------------------|-----------------------------------------------------------------------------|
| List all patients                        | GET    | `/api/patients/`                  | Returns all patients with nested medications                                |
| Create a new patient                      | POST   | `/api/patients/`                  | Create a patient and optionally include medications                         |
| Retrieve a patient                        | GET    | `/api/patients/<id>/`             | Get a single patient by ID, including medications                           |
| Full update                               | PUT    | `/api/patients/<id>/`             | Replace all patient fields and medications                                  |
| Partial update (keep previous meds)       | PATCH  | `/api/patients/<id>/`             | Update patient fields and add new medications without removing old ones     |
| Partial update (wipe previous meds)       | PATCH  | `/api/patients/<id>/?mode=wipe`  | Update patient fields and replace all medications with the new list         |
| Delete a patient                          | DELETE | `/api/patients/<id>/`             | Delete the patient and all their medications                                |
| Say hello to the API | GET | `/api/hello/` | Check the API's status by saying hi |

<h2>Database Seeding</h2>

I used [Faker](https://faker.readthedocs.io/en/master/) in `seed.py` to randomly seed the database with fake patient names, dates of birth, medications, etc. The data is intentionally messy, conflicting, and sometimes incomplete.
It can be reseeded with `python backend/manage.py seed` from the root directory.

<h1>My Process</h1>

Throughout the project, I thought of each Patient as an object containing Medication objects. I wanted users to be able to find a Patient object and then select it, revealing the Medication objects. This made more sense to me than, say, searching for a medication and then viewing which patients take such medication. Additionally, I knew that since the purpose of this exercise was to navigate around unreliable/inconsistent data, I let all data be nullable/optional.

As for displaying the data, I had a lot of ideas about a timeline with layers of boxes to show very intuitively what medication was being taken at what times (Gantt Chart). Maybe even being able to click the boxes to show advanced details about the medication. However, given the goals of the exercise, I prioritized correctness and clarity of data representation over a fully graphical timeline. It was very convenient to offload the graphical components to Material UI and focus solely on the data. This came with the tradeoff of having a clear timeline, but making it difficult to conceptualize gaps or duration, since the timeline is composed of ordered dates. 

If I were to continue this project, I would focus on making medication duration, gaps, and overlaps clearer. I would also like to add more search options, like a yyyy/mm/dd picker for the date of birth, and a "Sort by:" option for the Patient search and also the medication timeline. On the data side, I would introduce clearer indicators for conflicting or overlapping records (for example, confidence scores or source prioritization rules) to help users reason about which information is more reliable rather than letting users resolve conflicts on their own.