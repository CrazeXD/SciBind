from django.contrib import admin
from .models import User, Event, Binder

# Register your models here.
admin.site.register(User)
admin.site.register(Event)
admin.site.register(Binder)
