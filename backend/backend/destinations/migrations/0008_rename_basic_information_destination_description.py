# Generated by Django 5.1.2 on 2024-11-23 19:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('destinations', '0007_alter_destination_time_destinationscomment'),
    ]

    operations = [
        migrations.RenameField(
            model_name='destination',
            old_name='basic_information',
            new_name='description',
        ),
    ]
