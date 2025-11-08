from django.db import models

# Create your models here.

class Device(models.Model):
    id = models.AutoField(primary_key=True)
    serial_no = models.CharField(max_length=225, unique=True)

class Buildings(models.Model):
    id = models.AutoField(primary_key=True)
    temp = models.FloatField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    device = models.ForeignKey(Device,on_delete=models.SET_NULL, null=True, blank=True)