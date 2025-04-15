# admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models .auth import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'rol', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': ('username', 'rol', 'telefono')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)


# Register your models here.
