# Generated by Django 5.1.2 on 2024-12-07 19:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0006_favoriteactivity'),
    ]

    operations = [
        migrations.RenameField(
            model_name='activities',
            old_name='highlights',
            new_name='highlight',
        ),
    ]
