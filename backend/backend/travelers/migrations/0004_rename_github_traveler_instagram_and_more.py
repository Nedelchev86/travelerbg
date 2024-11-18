# Generated by Django 5.1.2 on 2024-11-18 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travelers', '0003_rename_first_name_traveler_name_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='traveler',
            old_name='github',
            new_name='instagram',
        ),
        migrations.RemoveField(
            model_name='traveler',
            name='nationality',
        ),
        migrations.AddField(
            model_name='traveler',
            name='youtube',
            field=models.URLField(blank=True, max_length=50, null=True),
        ),
    ]
