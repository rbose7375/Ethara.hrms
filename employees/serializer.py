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
        fields = '__all__'

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

class AttendanceSerializer(serializers.ModelSerializer):
    today_logs = serializers.SerializerMethodField()
    total_hours_today = serializers.SerializerMethodField()

    def get_total_hours_today(self, instance):
        today = instance.date
        logs = AttedanceLog.objects.filter(employee=instance.employee, attendance=instance, time_in__date=today)
        total_hours = sum(log._total_today() for log in logs)
        return total_hours

    def get_today_logs(self, instance):
        today = instance.date
        logs = AttedanceLog.objects.filter(employee=instance.employee, attendance=instance, time_in__date=today)
        return AttedanceLogSerializer(logs, many=True).data

    class Meta:
        model = Attendance
        fields = '__all__'
