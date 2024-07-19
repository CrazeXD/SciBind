from django.db import models


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField()
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    events = models.ManyToManyField('Event', related_name='users')

class Event(models.Model):
    name = models.CharField(max_length=100)
    # materialtype can either be 'binder', 'cheat sheet', or 'none'
    materialchoices = [
        ('binder', 'Binder'),
        ('cheat sheet', 'Cheat Sheet'),
        ('none', 'None')
    ]
    materialtype = models.CharField(max_length=100, choices=materialchoices)

class Binder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    
