from django.db import models
from django.utils import timezone
from portfolio.models import Portfolio

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('buy', 'Buy'),
        ('sell', 'Sell'),
        ('dividend', 'Dividend'),
    ]

    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    name = models.CharField(max_length=255, help_text="Asset name (e.g., 'Apple Inc.', 'Bitcoin').")
    symbol = models.CharField(max_length=50, help_text="Ticker symbol or identifier.")
    quantity = models.DecimalField(max_digits=20, decimal_places=8, help_text="Number of units involved in the transaction.")
    price_per_unit = models.DecimalField(max_digits=20, decimal_places=8, help_text="Price per unit at the time of transaction.")
    total_cost = models.DecimalField(max_digits=20, decimal_places=8, help_text="Total cost of the transaction.")
    transaction_date = models.DateTimeField(default=timezone.now)
    
    def save(self, *args, **kwargs):
        self.total_cost = self.quantity * self.price_per_unit
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_type.capitalize()} {self.quantity} {self.name} at {self.price_per_unit}"