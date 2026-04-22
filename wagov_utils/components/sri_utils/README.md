# SRI Utilities

Utilities for generating and retrieving SRI hashes that can be applied to a script tag's integrity attribute via Django tags.

Includes a management script for generating hashes for all static files, a utility for obtaining a hash for a given static file, and a Django template tag for directly integrating an obtained hash in to a script tag's integrity attribute.

## Requirements and Setup

After ensuring wagov-utils has been installed the following is required for setup:

- `wagov-utils.components.sri_utils` must be added to `INSTALLED_APPS` in settings.py
- `sri-manifest.json` and `sri-files/*` should be added to the repository .gitignore
- The environment variables STATIC_APP_NAME and STATIC_FILES_DIRECTORY_NAME should be set
> STATIC_APP_NAME should be the name of the application that the static directory is stored in (e.g. disturbance)
> STATIC_FILES_DIRECTORY_NAME should be the name of the folder that generated static files are stored in (e.g. staticfiles_ds)
- Also ensure settings.BASE_DIR is set (base directory of the relevant project)

Once all environments variables and configurations have been complete, the following management command can be run to generate hashes:

`python manage.py script_hash_indexes`

The above management command should be integrated in to an application's deployment setup after npm build and collectstatic have been run (via Dockerfile). 

## Implementation

The script integrity SRI hashes can be implemented in to any given Django template script tag by doing the following:
```
<!--in html-->
{% load sri_tags %}
<!--example script tag for "app_name" "test.js"-->
<script src="/static/app_name/test.js" crossorigin="anonymous" integrity="{% SRI_HASH '/static/app_name/test.js' %}"></script>
```