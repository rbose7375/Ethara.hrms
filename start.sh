#!/usr/bin/env bash
set -e

PORT="${PORT:-8000}"

python manage.py migrate --noinput

if python -c "import gunicorn" >/dev/null 2>&1; then
  exec gunicorn hrms.wsgi:application --bind "0.0.0.0:${PORT}"
fi

exec python manage.py runserver "0.0.0.0:${PORT}"
