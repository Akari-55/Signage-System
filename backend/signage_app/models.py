from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import os

class SampleDB(models.Model):
    class Meta:
        db_table = 'sample_table' # DB内で使用するテーブル名
        verbose_name_plural = 'sample_table' # Admionサイトで表示するテーブル名
    sample1 = models.IntegerField('sample1', null=True, blank=True) # 数値を格納
    sample2 = models.CharField('sample2', max_length=255, null=True, blank=True) # 文字列を格納
def content_file_name(instance,filename):
    ext=filename.split('.')[-1]
    new_filename=f"{instance.title}.{ext}"
    return os.path.join('uploads/',new_filename)
#デバイステーブル
class Device(models.Model):
    serial_number=models.CharField(max_length=100,unique=True)
    monitor_id=models.IntegerField()
    name=models.CharField(max_length=100)
    location=models.CharField(max_length=100)
    status=models.CharField(max_length=50)
    last_active=models.DateTimeField()
    def __str__(self):
        return self.serial_number

    #コンテンツテーブル
class Content(models.Model):
    title=models.CharField(max_length=100)
    device=models.ForeignKey(Device,on_delete=models.CASCADE)
    description=models.TextField()
    file=models.FileField(upload_to=content_file_name)
    status=models.CharField(max_length=50,default='未公開')
    content_type=models.CharField(max_length=50)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title

#スケジュールテーブル
class Schedule(models.Model):
    content_type=models.ForeignKey(ContentType,on_delete=models.CASCADE)
    object_id=models.PositiveIntegerField()
    content_object=GenericForeignKey('content_type','object_id')
    start_time=models.DateTimeField()
    end_time=models.DateTimeField()
    priority= models.IntegerField()

    def __str__(self):
        return f"{self.content_object}-{self.start_time} to {self.end_time}"

#コンテンツグループテーブル
class ContentGroup(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    device=models.ForeignKey(Device,on_delete=models.CASCADE)
    status=models.CharField(max_length=50,default='未公開')
    def __str__(self):
        return self.name

#コンテンツグループメンバーテーブル
class ContentGroupMember(models.Model):
    group=models.ForeignKey(ContentGroup,on_delete=models.CASCADE)
    content=models.ForeignKey(Content,on_delete=models.CASCADE)
    order=models.IntegerField()

    class Meta:
        ordering=['order']
    def __str__(self):
        return f"{self.group}-{self.content}"



#カスタムユーザーテーブル
class User(AbstractUser):
    role=models.CharField(max_length=50)

# Create your models here.
