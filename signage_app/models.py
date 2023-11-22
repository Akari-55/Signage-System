from django.db import models
from django.contrib.auth.models import AbstractUser

class SampleDB(models.Model):
    class Meta:
        db_table = 'sample_table' # DB内で使用するテーブル名
        verbose_name_plural = 'sample_table' # Admionサイトで表示するテーブル名
    sample1 = models.IntegerField('sample1', null=True, blank=True) # 数値を格納
    sample2 = models.CharField('sample2', max_length=255, null=True, blank=True) # 文字列を格納

#コンテンツテーブル
class Content(models.Model):
    title=models.CharField(max_length=100)
    description=models.TextField()
    file_path=models.FileField(upload_to='uploads/')
    duration=models.IntegerField()
    content_type=models.CharField(max_length=50)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

#デバイステーブル
class Device(models.Model):
    serial_number=models.CharField(max_length=100,unique=True)
    monitor_id=models.IntegerField()
    name=models.CharField(max_length=100)
    location=models.CharField(max_length=100)
    status=models.CharField(max_length=50)
    last_active=models.DateTimeField()

#スケジュールテーブル
class Schedule(models.Model):
    device=models.ForeignKey(Device,on_delete=models.CASCADE)
    content=models.ForeignKey(Content,on_delete=models.CASCADE)
    start_time=models.DateTimeField()
    end_time=models.DateTimeField()
    priority=models.IntegerField()

#コンテンツグループテーブル
class ContentGroup(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()

#コンテンツグループメンバーテーブル
class ContentGroupMember(models.Model):
    group=models.ForeignKey(ContentGroup,on_delete=models.CASCADE)
    content=models.ForeignKey(Content,on_delete=models.CASCADE)
    order=models.IntegerField()

#カスタムユーザーテーブル
class User(AbstractUser):
    role=models.CharField(max_length=50)

# Create your models here.
