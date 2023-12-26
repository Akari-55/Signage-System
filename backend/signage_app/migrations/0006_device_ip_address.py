# Generated by Django 4.2.7 on 2023-12-21 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('signage_app', '0005_alter_contentgroupmember_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='ip_address',
            field=models.GenericIPAddressField(default='192.192.192.192', unique=True),
            preserve_default=False,
        ),
    ]