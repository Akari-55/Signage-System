from rest_framework import serializers
from .models import Content,ContentGroup,ContentGroupMember

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Content
        fields=['id','title','description','file','duration','content_type','create_at','updated_at']

class ContentGroupMemberSerializer(serializers.ModelSerializer):
    content=ContentSerializer()

    class Meta:
        model=ContentGroupMember
        fields=['order','content']

class ContentGroupSerializer(serializers.ModelSerializer):
    members=ContentGroupMemberSerializer(many=True)

    class Meta:
        model=ContentGroup
        fields=['id','name','description','member']
