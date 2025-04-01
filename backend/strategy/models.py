from django.db import models
from account.models import Account

class Strategy(models.Model):
    RISK_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    INVESTMENT_TYPES = [
        ('stocks', 'Stocks'),
        ('bonds', 'Bonds'),
        ('crypto', 'Cryptocurrency'),
        ('real_estate', 'Real Estate'),
        ('index_funds', 'Index Funds'),
        ('etfs', 'ETFs'),
        ('commodities', 'Commodities'),
        ('mixed', 'Mixed'),
    ]

    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='strategies')
    name = models.CharField(max_length=100, help_text="Strategy name, e.g., 'Aggressive Growth' or 'Balanced Income'.")
    risk_tolerance = models.CharField(max_length=10, choices=RISK_LEVELS, default='medium')
    investment_type = models.CharField(max_length=20, choices=INVESTMENT_TYPES, default='mixed')
    target_return = models.DecimalField(max_digits=5, decimal_places=2, help_text="Expected return percentage (e.g., 7.5%)")
    investment_horizon = models.PositiveIntegerField(help_text="Investment duration in years.")
    diversification_level = models.PositiveIntegerField(help_text="Scale from 1 to 10 indicating diversification.")
    automated_trading = models.BooleanField(default=False, help_text="Enable automated trading for this strategy.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"
