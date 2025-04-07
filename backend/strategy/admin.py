from django.contrib import admin
from .models import Strategy

@admin.register(Strategy)
class StrategyAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'account', 'risk_tolerance', 'investment_type', 'target_return')
    list_filter = ('risk_tolerance', 'investment_type')
    search_fields = ('name',)
    ordering = ('name',)