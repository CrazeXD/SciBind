from django.db import models
from django.contrib.auth.models import AbstractUser
from helpers import document
# Create your models here.
class User(AbstractUser):
    chosen_events = models.ManyToManyField('Event', related_name='owners')

class EventModel(models.Model):
    name = models.CharField(max_length=100, unique=True, primary_key=True)
    # materialtype can either be 'binder', 'cheat sheet', or 'none'
    materialchoices = [
        ('binder', 'Binder'),
        ('cheat sheet', 'Cheat Sheet'),
        ('none', 'None')
    ]
    materialtype = models.CharField(max_length=100, choices=materialchoices)

class BinderModel(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(EventModel, on_delete=models.CASCADE)

    date = models.DateField(auto_now_add=True)
    shared_with = models.ManyToManyField(User, related_name='shared_binders')

class DocumentField(models.Model):
    ...