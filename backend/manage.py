#!/usr/bin/env python
"""Django's command-line utility for administrative tasks.
This file is lightly patched so that running:
    python manage.py migrate
will perform a safe, non-interactive migration flow that:
 - ensures DB_HOST in .env is 127.0.0.1 (force TCP connection)
 - runs makemigrations for local apps (no-op if nothing to create)
 - runs migrate with fake_initial=True to avoid "table already exists" errors

If you pass explicit migrate flags (e.g. --fake-initial, --plan, --database), the script will fall back to the default behavior so your flags are respected.

If you prefer the original behavior, run with: python manage.py migrate --no-prep
"""
import os
import sys


def ensure_env_db_host(env_path='.env'):
    try:
        if not os.path.exists(env_path):
            return
        with open(env_path, 'r') as f:
            lines = f.readlines()
        changed = False
        for i, line in enumerate(lines):
            if line.startswith('DB_HOST='):
                if not line.strip().startswith('DB_HOST=127.0.0.1'):
                    lines[i] = 'DB_HOST=127.0.0.1\n'
                    changed = True
                break
        else:
            # not found, append
            lines.append('DB_HOST=127.0.0.1\n')
            changed = True
        if changed:
            with open(env_path, 'w') as f:
                f.writelines(lines)
            print("[manage.py] Updated .env DB_HOST to 127.0.0.1 to force TCP MySQL connection")
    except Exception as e:
        print(f"[manage.py] Warning: failed to update .env: {e}")


def safe_migrate_flow(argv):
    """Run a safe migration flow programmatically and exit.
    This avoids the interactive failures caused by pre-existing tables, missing migrations, or socket vs TCP issues.
    """
    # Import Django management machinery now that DJANGO_SETTINGS_MODULE should be set
    try:
        from django.core.management import call_command
    except Exception as e:
        print(f"[manage.py] Error importing Django management: {e}")
        return 1

    # 1. Ensure .env DB_HOST points to 127.0.0.1
    ensure_env_db_host(env_path=os.path.join(os.path.dirname(__file__), '.env'))

    # 2. Run makemigrations (non-interactive)
    try:
        print("[manage.py] Running makemigrations (non-interactive)...")
        # Only create migrations for local apps. A simple call without args is fine.
        call_command('makemigrations', '--noinput')
    except SystemExit as se:
        # makemigrations may call sys.exit in some cases; continue
        print(f"[manage.py] makemigrations exited with {se}")
    except Exception as e:
        print(f"[manage.py] makemigrations warning: {e}")

    # 3. Run migrate with fake_initial by default to avoid 'table already exists' errors
    try:
        print("[manage.py] Running migrate --fake-initial --noinput...")
        call_command('migrate', fake_initial=True, interactive=False)
        print("[manage.py] Migrations completed successfully.")
        return 0
    except Exception as e:
        print(f"[manage.py] migrate failed: {e}")
        # In case of failure, fall back to the default CLI behavior
        return 2


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rental_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # If invoked as `python manage.py migrate` with no extra flags, run safe flow.
    # Respect explicit flags or user choices: if user passes --no-prep we skip the automatic prep.
    argv = sys.argv
    if len(argv) >= 2 and argv[1] == 'migrate' and '--no-prep' not in argv:
        # If any migrate-related flags are already present (e.g. --fake-initial or --plan), let Django handle them.
        migrate_flags = [a for a in argv[2:] if a.startswith('-')]
        if not migrate_flags:
            rc = safe_migrate_flow(argv)
            # If the safe flow succeeded, exit; otherwise fall back to default behavior.
            if rc == 0:
                return
            else:
                print('[manage.py] Falling back to default migrate behavior (respecting user flags)')

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
