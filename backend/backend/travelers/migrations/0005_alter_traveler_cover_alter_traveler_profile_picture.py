# Generated by Django 5.1.2 on 2024-11-20 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travelers', '0004_rename_github_traveler_instagram_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='traveler',
            name='cover',
            field=models.URLField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='traveler',
            name='profile_picture',
            field=models.URLField(blank=True, max_length=255, null=True),
        ),
    ]
