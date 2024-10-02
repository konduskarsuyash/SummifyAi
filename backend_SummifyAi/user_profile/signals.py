from django.db.models.signals import post_save
from django.contrib.auth.models import User
from .models import UserStatistics

def create_user_statistics(sender, instance, created, **kwargs):
    if created:
        UserStatistics.objects.create(user=instance)

post_save.connect(create_user_statistics, sender=User)
