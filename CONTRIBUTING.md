# Contributing

Hello! Thank you for considering contributing to SciBind.

## Development Setup

1. Clone the repository
2. Install Python dependencies: `pip install -r requirements.txt` (make an environment if you would like)
3. Install node dependencies: 
`cd frontend/scibind`
`npm install`
4. Set up pre-commit hooks: `pre-commit install`

## Formatting
When making changes, please try and follow along with the current style of similiar files. Formatting will be done automatically by pre-commit when you commit changes to the repository, but actual code structure should match what already exists.

The repository uses Black for formatting Python code, and Prettier for JavaScript/TypeScript.

## Project Structure
The project is structured into 2 main folders, backend and frontend.

### Backend
Backend contains the Django project called SciBind containing a backend API. This is used for authentication, storing documents, etc. If you are unfamiliar with Django, their documentation is quite thorough and you should be able to understand the code relatively simply.

#### app
All of the main code is stored in the 'app' directory.

models.py: Stores the ORM definitions for the database.

serializers.py: Contains serializers for the models to be passed to the frontend.

views.py: Contains functions that the backend can access through urls.py.

urls.py: Contains mappings for the views to the frontend. urls.py is included in the SciBind main app, under /api, so all urls in the 'app' directory have /api/ before them.

admin.py: Place to include models into the admin panel, found at /admin on the backend host.

tests.py: Defines unit tests for functionality in the backend.

#### lib 
Folder containing all data files that the backend needs to access.

#### helpers
Currently unused directory that will be used in the future for any scripts or functionality that makes more sense to be organized in a submodule.

#### management
##### commands
Startup scripts, such as loading data from libs into the database. Django will automatically find all Command classes and execute them.

#### migrations
Auto-generated files created by running `python manage.py makemigrations`. Migrations are needed any time changes are made to the models. Apply these changes by running `python manage.py migrate`.

#### media directory
Contains static files that the backend uses but is not serving for general content (e.g. profile pictures). 

#### SciBind
SciBind is the main project directory for the Django app. Read the Django documentation for more insight into what the files in this directory do.

### Frontend
The frontend is a Next.js project using TypeScript and TailwindCSS with DaisyUI for the theme.
All code is stored in the src directory. public/ and .next/ are auto-generated files that you do not need to touch. Inside src, use the app directory to store routes and pages, components to store individual components (try and keep these organized with folders), and libs for extra logic files for the frontend.

To install packages to the frontend, just use npm install package inside the scibind directory.

#### TipTap
The document editor in app/binder/[slug]/ uses TipTap for it's functionality. Please look at the TipTap documentation for any reference in this.


## Running the Project

To run the backend, run `python manage.py runserver` in the backend/SciBind directory. Make sure that you have made and applied migrations (see above).

To run the frontend, run `npm run dev` in the frontend/scibind directory. To see the application, click the link that comes up in the command output (localhost:3000).

## Publishing changes
Here are the steps to publish your changes to the repository.
1. Create a fork of the main repository.
2. Clone your fork to your local machine.
3. Make a new branch for your changes: `git checkout -b my-branch`
4. Make your changes and commit them.
5. Push your changes to your fork: `git push origin my-branch`
6. Create a pull request on the main repository.
7. Wait for your pull request to be reviewed and merged.

## Questions

If you have any questions, please create an issue on the repository. We are happy to help you out with any problems you may have.

Thank you for your contributions!
```

```markdown