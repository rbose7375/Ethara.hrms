from rest_framework import serializers

from .models import Employee, Attendance, AttedanceLog
from django.contrib.auth.models import User
from django.core.exceptions import MultipleObjectsReturned

class CreateEmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=100)
    email_address = serializers.EmailField()
    department = serializers.CharField(max_length=100)
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['email_address'],
                email=validated_data['email_address'],
                password=validated_data['password']  # You should handle password properly in production
            )
            employee = Employee.objects.create(
                user=user,
                full_name=validated_data['full_name'],
                email_address=validated_data['email_address'],
                department=validated_data['department']
            )
            return employee
        except MultipleObjectsReturned:
            raise serializers.ValidationError("An employee with this email already exists.")
        except Exception as e:
            raise serializers.ValidationError(str(e))

    class Meta:
        model = Employee
        fields = ['employee_id', 'full_name', 'email_address', 'department', 'password']
        read_only_fields = ['employee_id']

class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=100)
    email_address = serializers.EmailField()
    department = serializers.CharField(max_length=100)

    class Meta:
        model = Employee
        fields = '__all__'


class AttedanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttedanceLog
        fields = '__all__'

class AttendanceLogInputSerializer(serializers.Serializer):
    time_in = serializers.TimeField()
    time_out = serializers.TimeField()

    def validate(self, data):
        if data['time_out'] <= data['time_in']:
            raise serializers.ValidationError("Time out must be later than time in.")
        return data

class AdminAttendanceCreateSerializer(serializers.Serializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.filter(is_deleted=False), required=False)
    employee_id = serializers.IntegerField(required=False)
    date = serializers.DateField()
    status = serializers.CharField(max_length=20)
    time_in = serializers.TimeField(required=False, allow_null=True)
    time_out = serializers.TimeField(required=False, allow_null=True)
    logs = AttendanceLogInputSerializer(many=True, required=False)
    today_logs = AttendanceLogInputSerializer(many=True, required=False)

    def validate(self, data):
        employee = data.get('employee')
        employee_id = data.get('employee_id')

        if employee is None and employee_id is not None:
            try:
                employee = Employee.objects.get(employee_id=employee_id, is_deleted=False)
            except Employee.DoesNotExist as exc:
                raise serializers.ValidationError({'employee_id': 'Employee not found.'}) from exc

        if employee is None:
            raise serializers.ValidationError({'employee': 'This field is required.'})

        time_in = data.get('time_in')
        time_out = data.get('time_out')
        if (time_in is None) != (time_out is None):
            raise serializers.ValidationError('Both time in and time out are required together.')
        if time_in is not None and time_out is not None and time_out <= time_in:
            raise serializers.ValidationError('Time out must be later than time in.')

        log_entries = data.get('logs') or data.get('today_logs') or []
        if time_in is not None and time_out is not None:
            log_entries = [*log_entries, {'time_in': time_in, 'time_out': time_out}]

        data['employee'] = employee
        data['log_entries'] = log_entries
        return data

    def create(self, validated_data):
        employee = validated_data['employee']
        attendance_date = validated_data['date']
        status = validated_data['status']
        log_entries = validated_data.get('log_entries', [])

        attendance, created = Attendance.objects.get_or_create(
            employee=employee,
            date=attendance_date,
            defaults={'status': status},
        )

        if not created and attendance.status != status:
            attendance.status = status
            attendance.save(update_fields=['status', 'updated_at'])

        for log in log_entries:
            AttedanceLog.objects.get_or_create(
                employee=employee,
                attendance=attendance,
                time_in=log['time_in'],
                time_out=log['time_out'],
            )

        return attendance

class AttendanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.IntegerField(source='employee.employee_id', read_only=True)
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    today_logs = serializers.SerializerMethodField()
    logs = serializers.SerializerMethodField()
    total_hours_today = serializers.SerializerMethodField()
    total_working_hours = serializers.SerializerMethodField()
    total_working_time = serializers.SerializerMethodField()
    session_count = serializers.SerializerMethodField()

    def get_total_hours_today(self, instance):
        logs = AttedanceLog.objects.filter(employee=instance.employee, attendance=instance)
        total_hours = sum(log._total_today() for log in logs)
        return total_hours

    def get_today_logs(self, instance):
        logs = AttedanceLog.objects.filter(employee=instance.employee, attendance=instance)
        return AttedanceLogSerializer(logs, many=True).data

    def get_logs(self, instance):
        return self.get_today_logs(instance)

    def get_total_working_hours(self, instance):
        return self.get_total_hours_today(instance)

    def get_total_working_time(self, instance):
        return self.get_total_hours_today(instance)

    def get_session_count(self, instance):
        return AttedanceLog.objects.filter(employee=instance.employee, attendance=instance).count()

    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee',
            'employee_id',
            'employee_name',
            'date',
            'status',
            'today_logs',
            'logs',
            'total_hours_today',
            'total_working_hours',
            'total_working_time',
            'session_count',
            'is_deleted',
            'is_active',
            'deleted_at',
            'created_at',
            'updated_at',
        ]
