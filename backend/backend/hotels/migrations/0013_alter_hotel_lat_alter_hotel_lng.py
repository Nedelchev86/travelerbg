# Generated by Django 5.1.2 on 2024-11-20 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hotels', '0012_alter_hotel_lat_alter_hotel_lng'),
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
