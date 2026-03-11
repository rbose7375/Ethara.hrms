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
from .serializer import AdminAttendanceCreateSerializer, EmployeeSerializer, AttendanceSerializer, AttedanceLogSerializer
from django.utils import timezone
from stack_holders.models import StackHolder

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
                    "role" : "employee",
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

    def _is_admin_user(self, user):
        return StackHolder.objects.filter(user=user, is_deleted=False).exists()

    def _get_list_queryset(self, request):
        if self._is_admin_user(request.user):
            return self.queryset.order_by('-date', '-created_at')

        employee = Employee.objects.filter(user=request.user, is_deleted=False).first()
        if not employee:
            return Attendance.objects.none()

        return self.queryset.filter(employee=employee).order_by('-date', '-created_at')

    def create(self, request, *args, **kwargs):
        if not self._is_admin_user(request.user):
            return Response({'detail': 'Only admin users can create attendance records.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = AdminAttendanceCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attendance = serializer.save()
        return Response(AttendanceSerializer(attendance).data, status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        paginations = self.pagination_class()
        paginated_queryset = paginations.paginate_queryset(self._get_list_queryset(request), request)
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

        active_log = AttedanceLog.objects.filter(
            employee=employee,
            attendance=today,
            time_in__isnull=False,
            time_out__isnull=True,
        ).order_by('-time_in').first()

        if active_log:
            return Response(
                {
                    "error": "A time in session is already active for today.",
                    "active_log": AttedanceLogSerializer(active_log).data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

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

        log = AttedanceLog.objects.filter(
            employee=employee,
            attendance=today,
            time_in__isnull=False,
            time_out__isnull=True,
        ).order_by('-time_in').first()
        if not log:
            return Response({"error": "No active time in record found for today"}, status=status.HTTP_400_BAD_REQUEST)

        log.time_out = timezone.now().time()
        log.save()
        serializer = AttedanceLogSerializer(log)
        return Response(serializer.data, status=status.HTTP_200_OK)
