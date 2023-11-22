from django.contrib import admin
from .models import SampleDB,Content,Device,Schedule,ContentGroup,ContentGroupMember,User # models.pyで指定したクラス名

#コンテンツモデルの管理
class ContentAdmin(admin.ModelAdmin):
    list_display=('title','content_type','created_at','updated_at')
    serch_fields=('title','description')

#デバイスモデルの管理
class DeviceAdmin(admin.ModelAdmin):
    list_display=('name','serial_number','monitor_id','location','status','last_active')
    serch_fields=('name','location')

#スケジュールモデルの管理
class ScheduleAdmin(admin.ModelAdmin):
    list_display=('device','content','start_time','end_time','priority')
    search_fields=('device__name','content__title')

#コンテンツグループモデルの管理
class ContentGroupAdmin(admin.ModelAdmin):
    list_display=('name','description')
    serch_fields=('name',)

#コンテンツグループメンバーモデルの管理
class ContentGroupMemberAdmin(admin.ModelAdmin):
    list_display=('group','content','order')
    search_fields=('group__name','content__title')

#カスタムユーザーモデルの管理
class UserAdmin(admin.ModelAdmin):
    list_display=('username','email','role')
    search_fields=('username','email')

#モデルを管理サイトに登録
admin.site.register(SampleDB) # models.pyで指定したクラス名
admin.site.register(Content,ContentAdmin)
admin.site.register(Device,DeviceAdmin)
admin.site.register(Schedule,ScheduleAdmin)
admin.site.register(ContentGroup,ContentGroupAdmin)
admin.site.register(ContentGroupMember,ContentGroupMemberAdmin)
admin.site.register(User,UserAdmin)


# Register your models here.
