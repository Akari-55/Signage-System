# Generated by Django 5.0 on 2023-12-13 00:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('signage_app', '0004_alter_content_file'),
    ]

    operations = [
        migrations.CreateModel(
            name='Signage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='SignageContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField()),
                ('content', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='signage_app.content')),
                ('signage', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='signage_app.signage')),
            ],
        ),
        migrations.AddField(
            model_name='signage',
            name='contents',
            field=models.ManyToManyField(through='signage_app.SignageContent', to='signage_app.content'),
        ),
    ]