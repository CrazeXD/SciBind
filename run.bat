@echo off

call env/Scripts/activate
cd backend/SciBind
start "Django" cmd /c py manage.py runserver
cd ../../frontend/scibind
start "Next.js" cmd /c npm run dev
cd ../../