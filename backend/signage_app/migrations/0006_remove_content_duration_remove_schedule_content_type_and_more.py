# Generated by Django 4.2.7 on 2023-12-20 15:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('signage_app', '0005_alter_contentgroupmember_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='content',
            name='duration',
        ),
        migrations.RemoveField(
            model_name='schedule',
            name='content_type',
        ),
        migrations.AddField(
            model_name='content',
            name='status',
            field=models.CharField(default='未公開', max_length=50),
        ),
        migrations.AddField(
            model_name='contentgroup',
            name='status',
            field=models.CharField(default='未公開', max_length=50),
        ),
        migrations.AddField(
            model_name='schedule',
            name='content',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='schedules', to='signage_app.content'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='schedule',
            name='contentgroup',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='schedules', to='signage_app.contentgroup'),
            preserve_default=False,
        ),
    ]
