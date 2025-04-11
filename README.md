# Portfolia

## Team Members

- Konstantin Klironomos - 40242911
- Matteo Sansone - 40242278
- Michael Porato - 40264297

## About

This project presents a simulated AI-powered investment platform designed with a focus on personalization, real-time insights, and user-centered design. Built using React and Django, the platform leverages rule-based AI simulations to provide personalized investment recommendations, dynamic risk assessments, and visual feedback based on real-time portfolio data.

## Features
- Personalized Recommendations: Tailored insights based on user goals, risk profiles, and market data.
- Real-Time Risk Assessments: Adaptive risk models that evolve with market conditions.
- Intuitive UI/UX: Responsive interface with minimal cognitive load for ease of use.
- Usability Testing: Statistically significant improvements in decision accuracy, task completion time, and user satisfaction.

## Technologies Used
- Frontend: React
- Backend: Django, SQLite
- Data Analytics: Python (Pandas, NumPy, Matplotlib, Seaborn)
- Simulation: Rule-based AI system (in-house)

## Setup

### Frontend

```sh
cd frontend
npm i
npm run dev
```

### Backend

#### Windows

> Note: If you have NEVER setup the backend before, perform these steps. 

```sh
setup_backend.bat

cd backend
env\Scripts\activate

python manage.py createsuperuser
```

> Running the server.

```sh
python manage.py runserver
```

#### Unix-based OS
> Note: If you have NEVER setup the backend before, perform these steps. 

```sh
./setup_backend.sh

cd backend
source env/bin/activate

python manage.py createsuperuser
```

> Running the server.

```sh
python manage.py runserver
```
