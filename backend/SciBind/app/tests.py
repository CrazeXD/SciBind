import os
import csv

from django.test import TestCase
from .models import User, EventModel
# Create your tests here.
class UserCreationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user', password='test_password')
    
    def test_user_creation(self):
        user = self.user
        self.assertEqual(user.username, 'test_user')
        self.assertTrue(user.check_password('test_password'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        profile_picture = user.profile_picture
        path = 'media/profile_pictures/templates/'
        self.assertIn(profile_picture.url.rsplit("/")[-1], os.listdir(path))

class EventTest(TestCase):
    def setUp(self):
        # Make migrations and apply them
        os.system('python manage.py makemigrations')
        os.system('python manage.py migrate')
    def test_events_exist(self):
        with open('lib/events.csv', 'r') as file:
            reader = csv.reader(file)
            # sourcery skip: no-loop-in-tests
            for row in reader:
                event = EventModel.objects.get_or_create(
                    name = row[0],
                    materialtype = row[1],
                    division = row[2]
                )
                self.assertTrue(event)