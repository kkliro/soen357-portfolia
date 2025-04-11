#!/bin/bash

cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt

declare -a exclude_dirs=("backend")

for dir in */ ; do
    dir=${dir%*/}
    
    if [[ " ${exclude_dirs[@]} " =~ " ${dir} " ]]; then
        continue
    fi

    if [ ! -d "$dir/migrations" ] || [ ! -f "$dir/migrations/__init__.py" ]; then
        mkdir -p "$dir/migrations"
        touch "$dir/migrations/__init__.py"
    fi
done

rm db.sqlite3

python manage.py makemigrations account
python manage.py migrate account

python manage.py makemigrations
python manage.py migrate

deactivate