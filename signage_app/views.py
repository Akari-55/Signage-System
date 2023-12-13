from django.shortcuts import render,redirect,get_object_or_404  
from django.views.generic import ListView
from django.views.generic.edit import CreateView,UpdateView,DeleteView
from django.http import JsonResponse
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from .models import SampleDB,Content,ContentGroup
from .forms import ContentForm
from django.urls import reverse_lazy
from rest_framework import viewsets
from .serializers import ContentGroupSerializer



class ContentListView(ListView):
    model=Content
    template_name='signage_app/content_list.html'
    context_object_name='contents'
    def post(self,request,*args,**kwargs):
        selected_content_id=request.POST.get('selected_content')
        if selected_content_id:
            return redirect('signage_app:display_content',pk=selected_content_id)
        else:
            return self.get(request,*args,**kwargs,error_message='Please select a content.')

class ContentCreateView(CreateView):
    model=Content
    form_class=ContentForm
    template_name='signage_app/content_form.html'
    success_url=reverse_lazy('signage_app:contents')

class ContentUpdateView(UpdateView):
    model=Content
    form_class=ContentForm
    template_name='signage_app/content_form.html'
    success_url=reverse_lazy('signage_app:contents')

class ContentDeleteView(DeleteView):
    model=Content
    template_name='signage_app/content_confirm_delete.html'
    success_url=reverse_lazy('signage_app:contents')


def upload_file(request):
    if request.method =='POST':
        form=ContentForm(request.POST,request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'message':'ファイルがアップロードされました'})
        else:
            return JsonResponse({'error':form.errors},status=400)
    return render(request,'signage_app/upload.html',{'form':ContentForm()})


def content_list(request):
    contents=Content.objects.all()
    selected_content_id=request.POST.get('selected_content')
    if selected_content_id:
        return redirect('display_content',pk=selected_content_id)
    else:
        return render(request,'signage_app/content_list.html',{'contents':contents,'error_message':'Please select a content.'})
def display_content(request,pk):
    contents=get_object_or_404(Content,pk=pk)
    file_name=contents.file.name.lower()
    if file_name.endswith(('.png','.jpg','.jpeg')):
        contents.file_type='image'
    elif file_name.endswith('.mp4'):
        contents.file_type='video'
    else:
        contents.file_type='other'
    return render(request,'signage_app/display_content.html',{'contents':contents})

class ContentGroupViewSet(viewsets.ModelViewSet):
    queryset=ContentGroup.objects.prefetch_related('member__content').all()
    serializer_class=ContentGroupSerializer
# Create your views here.
