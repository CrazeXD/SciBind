# Django Backend

## Documentation

lib/ - Contains information files used by the server (e.g. things to load into the database)

media/ - Contains media files used by the server (e.g. profile pictures). User file uploads will go here.

To run the server, first make and apply migrations.

`py manage.py makemigrations`

`py manage.py migrate`

Then, run the server
`py manage.py runserver`
