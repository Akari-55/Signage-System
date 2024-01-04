from rest_framework import serializers
from .models import Content,FileModel,Device,Schedule,ContentGroup,ContentGroupMember
from django.contrib.contenttypes.models import ContentType

class ContentSerializer(serializers.ModelSerializer):
    created_at=serializers.DateTimeField(
            format="%Y/%m/%d",read_only=True
    )
    updated_at=serializers.DateTimeField(
            format="%Y/%m/%d",read_only=True
    )
    
    class Meta:
        model=Content
        fields=['id','title','description','file','content_type','created_at','updated_at','device','status']

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model=FileModel
        fields=('file','uploaded_at')
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Device
        fields=['id','ip_address','monitor_id','name','location','status','last_active']

class ScheduleSerializer(serializers.ModelSerializer):
    content_object=serializers.SerializerMethodField()

    class Meta:
        model=Schedule
        fields=['id','content','object_id','contentgroup','start_time','end_time','priority']

    def get_content_object(self,obj):
        if obj.content_type.model == 'content':
            serializer=ContentSerializer(obj.content_object)
        elif obj.content_type.model == 'contentgroup':
            serializer=ContentGroupSerializer(obj.content_object)
        else:
            return None
        return serializer.data

class ContentGroupMemberSerializer(serializers.ModelSerializer):
    content=ContentSerializer(read_only=True)

    class Meta:
        model=ContentGroupMember
        fields=['order','content']

class ContentGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model=ContentGroup
        fields=['id','name','description','status','device']

    def get_contents(self,obj):
        group_members=ContentGroupMember.objects.filter(group=obj)
        return ContentGroupMemberSerializer(group_members,many=True.data)
