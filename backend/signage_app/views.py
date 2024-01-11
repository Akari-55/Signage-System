from rest_framework import status,viewsets
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.views import APIView
from .serializers import ContentSerializer,FileSerializer,DeviceSerializer,ScheduleSerializer,ContentGroupMemberSerializer,ContentGroupSerializer
from .models import Content,Device,Schedule,ContentGroupMember,ContentGroup
from rest_framework.response import Response
from django.http import FileResponse
from rest_framework.decorators import action
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from celery import shared_task
from mimetypes import guess_type

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
            content=self.get_object()
            data = {key: value for key, value in request.data.items() if key != 'file'}
            # data=request.data.copy()
            
            file=request.FILES.get('file')
            if isinstance(file, (InMemoryUploadedFile, TemporaryUploadedFile)):
                # ファイルは 'FILE' 型です
                # ここでファイルの処理を行うことができます
                content.file.save(file.name, file, save=True)
                data['file'] = content.file
                
            else:
                # ファイルではない場合のエラー処理を行います
                print("ファイルではありません。")
            # if file:
            #     content.file.save(file.name,file,save=True)
            #     data['file']=content.file.url
            new_request_data = data.copy()
            for key, value in request.data.items():
                if key != 'file':
                    new_request_data[key] = value
            # for key in data.keys():
            #     if isinstance(data[key],list):
            #         data[key]=data[key][0]
            print("Received PUT Request for Content:")
            print("Request Data:", new_request_data)
            print("Files Data:",request.FILES) 
            serializer=self.get_serializer(content,data=new_request_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)
            else: 
                print(serializer.errors)
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Update error: {str(e)}")  # エラーをログに記録
            print(f"Update error: {str(e)}")  # エラーをコンソールに出力
            return Response({'messate':str(e)},status=status.HTTP_400_BAD_REQUEST)
    # def upload_file(self,request,pk=None):
    #     content=self.get_object()
    #     file=request.FILES.get('file')
    #     if file:
    #         content.file.save(file.name,file,save=True)
    #         return Response({"message":"File uploaded successfully!"},status=status.HTTP_200_OK)
    #     else:
    #         return Response({"message":"No file was provided ."},status=status.HTTP_400_BAD_REQUEST)

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
    
    @action(detail=True,methods=['get'])
    def get_file(self,request,pk=None):
        content=self.get_object()
        file_handle=content.file.open()
        guessed_content_type, _ = guess_type(content.file.name)
        if not guessed_content_type:
            guessed_content_type='application/octet-stream'
        response=FileResponse(file_handle,content_type=guessed_content_type)
        response['Content-Disposition']='attachment;filename="%s"' % content.file.name
        return response
    @action(detail=True,methods=['put'])
    def update_file(self,request,pk=None):
        content=self.get_object()
        file=request.data.get('file')
        if file:
            content.file = file  # 新しいファイルで更新
            content.save()  # 変更を保存

            return Response({'status': 'file updated'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'no file provided'}, status=status.HTTP_400_BAD_REQUEST)    
class FileUploadView(APIView):
    print("ok!!")
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
    print("ok")

    def get_queryset(self):
        device_id=self.request.query_params.get('monitor_id')
        queryset=ContentGroup.objects.all()
        if device_id:
            queryset=queryset.filter(device__monitor_id=device_id)
        return queryset

    def destroy(self,request,*args,**kwargs):
        instance=self.get_object()
        self.perform_destroy(instance)
        return Response(satus=status.HTTP_204_NO_CONTENT)

    def update(self,request,*args,**kwargs):
        response={'message':'UPDATE method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self,request,*args,**kwargs):
        response={'message':'PATCH method is not allowed'}
        return Response(response,status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self,request,* args,**kwargs):
        print('ok')
        instance=self.get_object()
        serializer=self.get_serializer(instance)
        return Response(serializer.data)
    def create(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers=self.get_success_headers(serializer.data)
        return Response(serializer.data,status=status.HTTP_201_CREATED,headers=headers)

class ContentGroupMemberViewSet(viewsets.ModelViewSet):
    queryset=ContentGroupMember.objects.all()
    serializer_class=ContentGroupMemberSerializer

    def destroy(self,request,*args,**kwargs):
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
    def retrieve(self,request,* args,**kwargs):
        instance=self.get_object()
        serializer=self.get_serializer(instance)
        return Response(serializer.data)
    
