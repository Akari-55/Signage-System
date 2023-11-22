from django.urls import path
from .views import ContentListView,ContentCreateView,ContentUpdateView,ContentDeleteView
from . import views

app_name = 'signage_app'
urlpatterns = [
    path('contents/',ContentListView.as_view(),name='contents'),
    path('contents/create/',ContentCreateView.as_view(),name='content_create'),
    path('contents/<int:pk>/edit/',ContentUpdateView.as_view(),name='content_edit'),
    path('contents/<int:pk>/delete/',ContentDeleteView.as_view(),name='content_delete'),
    path('upload/',views.upload_file,name='upload_file'),

]

