from django.contrib import admin
from .models import Portfolio

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'account', 'strategy', 'currency', 'created_at', 'updated_at')
    ordering = ('name',)