from rest_framework import status,viewsets
from .serializers import ContentSerializer,DeviceSerializer,ScheduleSerializer,ContentGroupMemberSerializer,ContentGroupSerializer
from .models import Content,Device,Schedule,ContentGroupMember,ContentGroup
from rest_framework.response import Response

class ContentViewSet(viewsets.ModelViewSet):
    queryset=Content.objects.all()
    serializer_class=ContentSerializer

    def destroy(self,request,*args,**kwargs):
        response={'message':'DELETE mothod is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

    def update(self,request,*args,**kwargs):
        response={'message':'UPDATE method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self,request,*args,**kwargs):
        response={'message':'PATCH method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        device_id=self.request.query_params.get('device_id')
        return Content.objects.filter(device__device_id=device_id)

    def create(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers=self.get_success_headers(serializer.data)
        return Response(serializer.data,status=status.HTTP_201_CREATED,headers=headers)

class DeviceViewSet(viewsets.ModelViewSet):
    queryset=Device.objects.all()
    serializer_class=DeviceSerializer

    def partial_update(self,request,*args,**kwargs):
        response={'message':'PATCH method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)
    
class ScheduleViewSet(viewsets.ModelViewSet):
    queryset=Schedule.objects.all()
    serializer_class=ScheduleSerializer

    def get_queryset(self):
        content_id=self.request.query_params.get('content_id')
        if content_id:
            return Schedule.objects.filter(content_id=content_id)
        return super().get_queryset()

    def destoroy(self,request,*args,**kwargs):
        response={'message':'DELETE method is not allowed' }
        return Response(response,status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self,request,*args,**kwargs):
        response={'message':'PATCH method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

    def create(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers=self.get_success_headers(serializer.data)
        return Response(serializer.data,status=status.HTTP_201_CREATED,headers=headers)

class ContentGroupViewSet(viewsets.ModelViewSet):
    queryset=ContentGroup.objects.all()
    serializer_class=ContentGroupSerializer

    def get_queryset(self):
        device_id=self.request.query_params.get('device_id')
        return Content.objects.filter(device__device_id=device_id)

    def destoroy(self,request,*args,**kwargs):
        response={'message':'DELETE method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

    def update(self,request,*args,**kwargs):
        reaponse={'message':'UPDATE method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self,request,*args,**kwargs):
        response={'message':'PATCH method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

class ContentGroupMemberViewSet(viewsets.ModelViewSet):
    queryset=ContentGroupMember.objects.all()
    serializer_class=ContentGroupMemberSerializer

    def destoroy(self,request,*args,**kwargs):
        response={'message':'DELETE method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

    def update(self,request,*args,**kwargs):
        reaponse={'message':'UPDATE method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self,request,*args,**kwargs):
        response={'message':'PATCH method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)
    
    def create(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers=self.get_success_headers(serializer.data)
        return Response(serializer.data,status=status.HTTP_201_CREATED,headers=headers)
