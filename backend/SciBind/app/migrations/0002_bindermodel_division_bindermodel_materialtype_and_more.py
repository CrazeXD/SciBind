# Generated by Django 5.0.7 on 2024-07-24 07:55

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='bindermodel',
            name='division',
            field=models.CharField(blank=True, choices=[('a', 'a'), ('b', 'b'), ('c', 'c')], max_length=1),
        ),
        migrations.AddField(
            model_name='bindermodel',
            name='materialtype',
            field=models.CharField(blank=True, choices=[('binder', 'Binder'), ('cheat sheet', 'Cheat Sheet'), ('none', 'None')], max_length=100),
        ),
        migrations.AlterField(
            model_name='bindermodel',
            name='shared_with',
            field=models.ManyToManyField(blank=True, related_name='shared_binders', to=settings.AUTH_USER_MODEL),
        ),
    ]
