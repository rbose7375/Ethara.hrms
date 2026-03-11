from django.urls import path, include
from rest_framework import routers
from .views import EmployeeLoginViewSet, EmployeeAttendanceViewSet, EmployeeWorkInViewSet, EmployeeWorkOutViewSet

routers = routers.DefaultRouter()
routers.register(r'login', EmployeeLoginViewSet, basename='employee-login')
routers.register(r'attendance', EmployeeAttendanceViewSet, basename='employee-attendance')

urlpatterns = [
    path('', include(routers.urls)),
    path(r'time-in', EmployeeWorkInViewSet.as_view(), name='employee-work-in'),
    path(r'time-out', EmployeeWorkOutViewSet.as_view(), name='employee-work-out'),
]