#!/usr/bin/env bash
set -euo pipefail

# Run from the backend/ directory. This script:
# 1. Ensures DB_HOST in .env is 127.0.0.1 (force TCP, avoid socket problems)
# 2. Uses the project's venv python if available
# 3. Ensures migrations exist (makemigrations)
# 4. Runs migrate with --fake-initial to avoid "table already exists" failures
# 5. Optionally creates/updates a superuser when ADMIN_USER/ADMIN_PASS env vars are set

HERE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE_DIR"

echo "Working directory: $HERE_DIR"

# Ensure .env DB_HOST=127.0.0.1
if [ -f .env ]; then
  if grep -qE '^DB_HOST=' .env; then
    sed -i -E "s/^DB_HOST=.*/DB_HOST=127.0.0.1/" .env
    echo "Set DB_HOST=127.0.0.1 in .env"
  else
    echo "DB_HOST=127.0.0.1" >> .env
    echo "Appended DB_HOST=127.0.0.1 to .env"
  fi
else
  echo ".env file not found; creating one with DB_HOST=127.0.0.1"
  cat > .env <<EOF
DB_HOST=127.0.0.1
EOF
fi

# Choose python executable from venv if available
if [ -x "./venv/bin/python3" ]; then
  PY="./venv/bin/python3"
elif [ -x "./venv/bin/python" ]; then
  PY="./venv/bin/python"
else
  PY="$(command -v python3 || command -v python)"
fi

echo "Using Python: $PY"

# Ensure Django is importable; if not, attempt to install from requirements.txt
if ! $PY - <<PYCODE >/dev/null 2>&1
try:
    import django
except Exception:
    raise SystemExit(1)
PYCODE
then
  echo "Django not found in the selected Python. Attempting to install requirements (this may require network)."
  if [ -f requirements.txt ]; then
    $PY -m pip install -r requirements.txt
  else
    $PY -m pip install django mysqlclient
  fi
fi

# Create migrations for local apps (no-op if none to create)
echo "Running makemigrations..."
$PY manage.py makemigrations --noinput || true

# Run migrate using --fake-initial to prevent "table already exists" errors
echo "Running migrate --fake-initial..."
$PY manage.py migrate --fake-initial --noinput

# Optionally create an admin user if ADMIN_USER and ADMIN_PASS are provided
if [ -n "${ADMIN_USER:-}" ] && [ -n "${ADMIN_PASS:-}" ]; then
  ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}"
  echo "Creating/updating admin user '$ADMIN_USER'..."
  $PY manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u,created=User.objects.get_or_create(username=\"$ADMIN_USER\", defaults={'email': \"$ADMIN_EMAIL\"}); u.set_password(\"$ADMIN_PASS\"); u.is_superuser=True; u.is_staff=True; u.save(); print(('Created' if created else 'Updated') + ' user ' + u.username)"
fi

echo "Done. If you still see errors, run this script again and inspect output."

