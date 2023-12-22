from django.urls import include,path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from .views import ContentViewSet,DeviceViewSet,ScheduleViewSet,ContentGroupViewSet,ContentGroupMemberViewSet


app_name = 'signage_app'
router=routers.DefaultRouter()
router.register(r'content',ContentViewSet)
router.register('device',DeviceViewSet)
router.register('schedule',ScheduleViewSet)
router.register('contentgroup',ContentGroupViewSet)
router.register('contentgroupmember',ContentGroupMemberViewSet)
urlpatterns = [
    path('',include(router.urls))

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
