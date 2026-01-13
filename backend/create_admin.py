from django.contrib.auth import get_user_model
User = get_user_model()
try:
    u, created = User.objects.get_or_create(username='admin', defaults={'email':'admin@test.com'})
    u.set_password('admin123')
    u.is_superuser = True
    u.is_staff = True
    u.save()
    print({'created': created, 'username': u.username, 'id': u.id})
except Exception as e:
    import traceback
    traceback.print_exc()
