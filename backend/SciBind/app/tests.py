import os
import csv

from django.test import TestCase

from .models import User, EventModel

from rest_framework.authtoken.models import Token

# Create your tests here.


class UserCreationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test_user", password="test_password"
        )

    def test_user_creation(self):
        user = self.user
        self.assertEqual(user.username, "test_user")
        self.assertTrue(user.check_password("test_password"))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        profile_picture = user.profile_picture
        path = "lib/images/profile_pictures/"
        self.assertIn(profile_picture.url.rsplit("/")[-1], os.listdir(path))


class EventTest(TestCase):
    def setUp(self):
        # Make migrations and apply them
        os.system("python manage.py makemigrations")
        os.system("python manage.py migrate")

    def test_events_exist(self):
        with open("lib/events.csv", "r") as file:
            reader = csv.reader(file)
            # sourcery skip: no-loop-in-tests
            for row in reader:
                event = EventModel.objects.get_or_create(
                    name=row[0],
                    materialtype=row[1],
                    division=row[2],
                    display_image=row[3],
                )
                self.assertTrue(event)

    def test_event_selection(self):
        # Create a user
        user = User.objects.create_user(username="test_user", password="test_password")
        # Create an event
        event = EventModel.objects.get(
            name="Anatomy and Physiology", materialtype="Cheatsheet", division="B"
        )
        token = Token.objects.get_or_create(user=user)
        event_id = event.id
        response = self.client.post(
            "/api/event-set/",
            {
                "user": user,
                "events": [event_id],
            },
            headers={"Authorization": f"Token {token[0].key}"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(user.chosen_events.all()[0].id, event_id)
        response = self.client.get(
            "/api/user-events/", headers={"Authorization": f"Token {token[0].key}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["id"], event_id)


class ProfilePictureTest(TestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(
            username="test_user", password="test_password"
        )
        self.token = Token.objects.get_or_create(user=self.user)

    def test_profile_picture(self):
        response = self.client.get(
            "/api/picture/", headers={"Authorization": f"Token {self.token[0].key}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response["Content-Disposition"],
            f"inline; filename={str(self.user.profile_picture).rsplit('\\')[-1].rsplit('/')[-1]}",
        )
