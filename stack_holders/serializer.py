from rest_framework import serializers
from .models import StackHolder

class StackHolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = StackHolder
        fields = '__all__'