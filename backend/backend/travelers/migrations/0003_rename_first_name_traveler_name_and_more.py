# Generated by Django 5.1.2 on 2024-11-17 10:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('travelers', '0002_rating'),
    ]

    operations = [
        migrations.RenameField(
            model_name='traveler',
            old_name='first_name',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='traveler',
            name='last_name',
        ),
    ]
