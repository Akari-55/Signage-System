# Generated by Django 4.2.7 on 2023-11-25 10:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('signage_app', '0002_alter_content_file_path'),
    ]

    operations = [
        migrations.RenameField(
            model_name='content',
            old_name='file_path',
            new_name='file',
        ),
    ]
