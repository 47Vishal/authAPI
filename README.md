
Before run the frontend code in "frontend_blogproject_ui"
npm install
npm start

Before run the frontend code in "AuthAPI"
mkvirtualenv authenv
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
