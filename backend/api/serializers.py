from rest_framework import serializers

class FormDataSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    dob = serializers.DateField()
    sex = serializers.CharField(max_length=6)
    patient_id = serializers.CharField(max_length=100)
    room_num = serializers.CharField(max_length=100)
    height = serializers.CharField()
    weight = serializers.CharField()
    