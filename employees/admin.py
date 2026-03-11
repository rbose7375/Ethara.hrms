from django.contrib import admin
from .models import Employee, Attendance, AttedanceLog

admin.register(Employee)
admin.register(Attendance)
admin.register(AttedanceLog)