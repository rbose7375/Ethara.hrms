from django.db import models
from django.utils import timezone
from datetime import datetime, date, timedelta
# Create your models here.

class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    email_address = models.EmailField(unique=True)
    department = models.CharField(max_length=50)

    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name
    

class Attendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20)

    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.full_name} - {self.date} - {self.status}"

class AttedanceLog(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    time_in = models.TimeField()
    time_out = models.TimeField()
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE)

    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.full_name} - {self.time_in} to {self.time_out}"
    
    def _total_today(self):
        if self.time_out and self.time_in:
            total_time = datetime.combine(date.min, self.time_out) - datetime.combine(date.min, self.time_in)
            return total_time / timedelta(minutes=60)  # return total time in hours
        return timedelta(0)