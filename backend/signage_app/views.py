from rest_framework import status,viewsets
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.views import APIView
from .serializers import ContentSerializer,FileSerializer,DeviceSerializer,ScheduleSerializer,ContentGroupMemberSerializer,ContentGroupSerializer
from .models import Content,Device,Schedule,ContentGroupMember,ContentGroup
from rest_framework.response import Response
import logging

class ContentViewSet(viewsets.ModelViewSet):
    queryset=Content.objects.all()
    serializer_class=ContentSerializer
    parser_classes=(MultiPartParser,FormParser,JSONParser)

    def destroy(self,request,*args,**kwargs):
        instance=self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self,request,*args,**kwargs):
        logger=logging.getLogger(__name__)
        
        try:
            print("Received PUT Request for Content:")
            print("Request Data:", request.data)
            print("Files Data:",request.FILES) 
        
            content=self.get_object()
            serializer=self.get_serializer(content,data={**request.data,**request.FILES})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)
            else: 
                print(serializer.errors)
            
        except Exception as e:
            logger.error(f"Update error: {str(e)}")  # エラーをログに記録
            print(f"Update error: {str(e)}")  # エラーをコンソールに出力
            return Response({'messate':str(e)},status=status.HTTP_400_BAD_REQUEST)
    def upload_file(self,request,pk=None):
        content=self.get_object()
        file=request.FILES.get('file')
        if file:
            content.file.save(file.name,file,save=True)
            return Response({"message":"File uploaded successfully!"},status=status.HTTP_200_OK)
        else:
            return Response({"message":"No file was provided ."},status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self,request,*args,**kwargs):
        instance=self.get_object()
        serializer=self.get_serializer(instance,data=request.data,partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        device_id=self.request.query_params.get('monitor_id')
        queryset=Content.objects.order_by('-updated_at')
        if device_id:
            queryset=queryset.filter(device__monitor_id=device_id)
        return queryset

    def create(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers=self.get_success_headers(serializer.data)
        return Response(serializer.data,status=status.HTTP_201_CREATED,headers=headers)
    
    def retrieve(self,request,*args,**kwargs):
        print('ok')
        instance=self.get_object()
        serializer=self.get_serializer(instance)
        return Response(serializer.data)
    
class FileUploadView(APIView):
    parser_classes=[MultiPartParser,FormParser]
    def post(self,request,*args,**kwargs):
        file_serializer=FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data,status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.error,status=status.HTTP_400_BAD_REQUEST)
        

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
        contentgroup_id=self.request.query_params.get('contentgroup_id')
        if content_id:
            return Schedule.objects.filter(content_id=content_id)
        elif contentgroup_id:
            return Schedule.objects.filter(contentgroup_id=contentgroup_id)
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
        device_id=self.request.query_params.get('monitor_id')
        return Content.objects.filter(device__monitor_id=device_id)

    def destoroy(self,request,*args,**kwargs):
        response={'message':'DELETE method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

    def update(self,request,*args,**kwargs):
        response={'message':'UPDATE method is not allowed'}
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
        response={'message':'UPDATE method is not allowed'}
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
    
