from django.urls import include, path
from rest_framework import routers
from .views import StackHolderViewSet, EmployeeViewSet
router = routers.DefaultRouter()
router.register(r'login', StackHolderViewSet, basename='stackholder')
router.register(r'employees', EmployeeViewSet, basename='stackholder')

urlpatterns = [
    path('', include(router.urls)),
]
