from django.db import models
from django.contrib.auth.models import User

class Restaurant(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    address = models.TextField()
    city = models.CharField(max_length=100, default='Hosur')
    state = models.CharField(max_length=100, default='Tamil Nadu')
    pincode = models.CharField(max_length=20, default='635109')
    phone = models.CharField(max_length=20)
    cuisine = models.CharField(max_length=150, default='Healthy Food')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    delivery_time = models.IntegerField(default=30)  # minutes
    delivery_charge = models.DecimalField(max_digits=6, decimal_places=2, default=30.00)
    image = models.CharField(max_length=500, blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-rating', '-created_at']

    def __str__(self):
        return f"{self.name} ({self.city})"
