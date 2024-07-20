from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    chosen_events = models.ManyToManyField('Event', related_name='owners')

class Event(models.Model):
    name = models.CharField(max_length=100, unique=True, primary_key=True)
    # materialtype can either be 'binder', 'cheat sheet', or 'none'
    materialchoices = [
        ('binder', 'Binder'),
        ('cheat sheet', 'Cheat Sheet'),
        ('none', 'None')
    ]
    materialtype = models.CharField(max_length=100, choices=materialchoices)

class Binder(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    file = models.FileField(upload_to='binders/')
    date = models.DateField(auto_now_add=True)
    shared_with = models.ManyToManyField(User, related_name='shared_binders')
    