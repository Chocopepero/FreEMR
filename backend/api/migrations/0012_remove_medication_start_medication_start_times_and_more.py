# Generated by Django 5.2 on 2025-05-24 09:02

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_medication_dose_medication_frequency_medication_prn_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='medication',
            name='start',
        ),
        migrations.AddField(
            model_name='medication',
            name='start_times',
            field=models.JSONField(default={}),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='medication',
            name='stop',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]
