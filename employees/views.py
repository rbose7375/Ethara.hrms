from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import pagination
from rest_framework.views import APIView

from hrms.authentication_user import LoginSerializer
from .models import Employee, AttedanceLog,Attendance
from .serializer import EmployeeSerializer, AttendanceSerializer, AttedanceLogSerializer
from django.utils import timezone

class EmployeeLoginViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    login_serializer_class = LoginSerializer
    queryset = Employee.objects.filter(is_deleted=False)
    #disable other actions except create
    http_method_names = ['put', 'post', 'patch']
    
    def update(self, request, *args, **kwargs):
        employee = self.get_object()
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request):
        user = LoginSerializer(data=request.data)
        try:
            if user.is_valid():
                user = user.validated_data["user"]
                token, created = Token.objects.get_or_create(user=user)
                employee = Employee.objects.get(user=user)
                serializer = EmployeeSerializer(employee)

                return Response({
                    "token": token.key,
                    "user_data": serializer.data
                }, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        


class EmployeeAttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.filter(is_deleted=False)
    serializer_class = AttendanceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = pagination.PageNumberPagination
    pagination_class.page_size = 30
    filter_backends = []
    http_method_names = ['get', 'post']

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        paginations = self.pagination_class()
        paginated_queryset = paginations.paginate_queryset(self.queryset, request)
        serializer = self.serializer_class(paginated_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class EmployeeWorkInViewSet(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        employee = Employee.objects.get(user=request.user)
        today = Attendance.objects.filter(employee=employee, date=timezone.now().date()).first()
        if not today:
            today = Attendance.objects.create(employee=employee, date=timezone.now().date(), status='Present')
        
        time_in = timezone.now().time()
        log = AttedanceLog.objects.create(employee=employee, time_in=time_in, attendance=today)
        serializer = AttedanceLogSerializer(log)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class EmployeeWorkOutViewSet(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        employee = Employee.objects.get(user=request.user)
        today = Attendance.objects.filter(employee=employee, date=timezone.now().date()).first()
        if not today:
            return Response({"error": "No attendance record found for today"}, status=status.HTTP_404_NOT_FOUND)
        
        log = AttedanceLog.objects.filter(employee=employee, attendance=today).order_by('-time_in').first()
        if not log:
            return Response({"error": "No time in record found for today"}, status=status.HTTP_404_NOT_FOUND)
        
        log.time_out = timezone.now().time()
        log.save()
        serializer = AttedanceLogSerializer(log)
        return Response(serializer.data, status=status.HTTP_200_OK)