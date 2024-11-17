# Generated by Django 5.1.2 on 2024-11-17 06:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hotels', '0005_hotel_lat_hotel_lng'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hotel',
            name='lat',
            field=models.DecimalField(blank=True, decimal_places=16, max_digits=20, null=True),
        ),
        migrations.AlterField(
            model_name='hotel',
            name='lng',
            field=models.DecimalField(blank=True, decimal_places=16, max_digits=20, null=True),
        ),
    ]