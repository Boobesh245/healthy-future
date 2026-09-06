# pyrefly: ignore [missing-import]
from django.core.management.base import BaseCommand
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User
# pyrefly: ignore [missing-import]
from accounts.models import UserProfile
        
class Command(BaseCommand):
    help = 'Creates default admin user if not exists'

    def handle(self, *args, **options):
        username = 'admin'
        password = 'admin@123'
        email = 'admin@healthyfuture.com'

        user, created = User.objects.get_or_create(username=username, defaults={'email': email})
        if created:
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            profile = getattr(user, 'profile', None)
            if profile:
                profile.role = 'admin'
                profile.save()
            self.stdout.write(self.style.SUCCESS(f"Default admin created successfully ({username} / {password})"))
        else:
            user.is_superuser = True
            user.is_staff = True
            user.set_password(password)
            user.save()
            if hasattr(user, 'profile'):
                user.profile.role = 'admin'
                user.profile.save()
            self.stdout.write(self.style.SUCCESS("Default admin updated / verified."))
