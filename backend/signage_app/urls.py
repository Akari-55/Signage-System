from django.urls import include,path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from .views import ContentViewSet,FileUploadView,DeviceViewSet,ScheduleViewSet,ContentGroupViewSet,ContentGroupMemberViewSet


app_name = 'signage_app'
router=routers.DefaultRouter()
router.register(r'content',ContentViewSet)
router.register('device',DeviceViewSet)
router.register('schedule',ScheduleViewSet)
router.register(r'contentgroup',ContentGroupViewSet)
router.register('contentgroupmember',ContentGroupMemberViewSet)
urlpatterns = [
    path('',include(router.urls)),
    path('content/<int:pk>/',ContentViewSet.as_view({'get':'retrieve'}),name='content_detail'),
    path('content/edit/<int:pk>/',ContentViewSet.as_view({'get':'retrieve'})),
    path('content/<int:pk>/upload/',FileUploadView.as_view(),name='file-upload'),
    path('contentgroup/<int:pk>/',ContentGroupViewSet.as_view({'get':'retrieve'}),name='contentgroup_detail'),
    

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
