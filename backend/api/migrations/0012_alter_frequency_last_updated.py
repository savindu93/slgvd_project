# Generated by Django 5.0.6 on 2025-01-02 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_frequency_last_updated'),
    ]

    operations = [
        migrations.AlterField(
            model_name='frequency',
            name='last_updated',
            field=models.JSONField(null=True),
        ),
    ]
