from django.contrib import admin
from .models import User, EventModel, BinderModel

# Register your models here.
admin.site.register(User)
admin.site.register(EventModel)
admin.site.register(BinderModel)
