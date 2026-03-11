from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework import pagination

from .models import StackHolder
from .serializer import StackHolderSerializer
from django_filters.rest_framework import DjangoFilterBackend

from hrms.authentication_user import LoginSerializer

from employees.serializer import CreateEmployeeSerializer, EmployeeSerializer
from employees.models import Employee
# Create your views here.

class StackHolderViewSet(viewsets.ModelViewSet):
    queryset = StackHolder.objects.filter(is_deleted=False)
    serializer_class = StackHolderSerializer

    def create(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token, created = Token.objects.get_or_create(user=user)
            stack = StackHolder.objects.get(user=user)
            serializer = StackHolderSerializer(stack)

            return Response({
                "token": token.key,
                "user_data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.filter(is_deleted=False)
    serializer_class = EmployeeSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = pagination.PageNumberPagination
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["employee_id","full_name","email_address","department","is_deleted","is_active","deleted_at","created_at"]

    def create(self, request, *args, **kwargs):
        employee = CreateEmployeeSerializer(data=request.data)
        if employee.is_valid():
            employee.save()
            return Response(employee.data, status=status.HTTP_201_CREATED)
        return Response(employee.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request, *args, **kwargs):
        paginations = self.pagination_class()
        paginated_queryset = paginations.paginate_queryset(self.queryset, request)
        serializer = self.serializer_class(paginated_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    

        