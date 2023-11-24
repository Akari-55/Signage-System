from django.shortcuts import render  
from django.views.generic import ListView
from django.views.generic.edit import CreateView,UpdateView,DeleteView
from django.http import JsonResponse
from .models import SampleDB,Content
from .forms import ContentForm
from django.urls import reverse_lazy



class ContentListView(ListView):
    model=Content
    template_name='signage_app/content_list.html'
    context_object_name='contents'

class ContentCreateView(CreateView):
    model=Content
    form_class=ContentForm
    template_name='signage_app/content_form.html'
    success_url='contents/'

class ContentUpdateView(UpdateView):
    model=Content
    form_class=ContentForm
    template_name='signage_app/content_form.html'
    success_url='/contents/'

class ContentDeleteView(DeleteView):
    model=Content
    template_name='signage_app/content_confirm_delete.html'
    success_url=reverse_lazy('contents')


def upload_file(request):
    if request.method =='POST':
        form=ContentForm(request.POST,request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'message':'ファイルがアップロードされました'})
        else:
            return JsonResponse({'error':form.errors},status=400)
    return render(request,'signage_app/upload.html',{'form':ContentForm()})




# Create your views here.
