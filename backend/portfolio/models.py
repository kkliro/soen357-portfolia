from django.db import models
from django.core.exceptions import ValidationError
from account.models import Account
from strategy.models import Strategy

class Portfolio(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='portfolios')
    strategy = models.ForeignKey(Strategy, on_delete=models.CASCADE, related_name='portfolios')
    currency = models.CharField(max_length=3, default='USD', help_text="Currency code (e.g., 'USD', 'EUR').")

    def __str__(self):
        return self.name

    def clean(self):
        SUPPORTED_CURRENCIES = ['USD', 'EUR', 'CAD', 'GBP']
        if self.currency not in SUPPORTED_CURRENCIES:
            raise ValidationError({'currency': 'Unsupported currency.'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)