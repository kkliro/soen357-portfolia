from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'portfolio', 'transaction_type', 'name', 'symbol', 'quantity', 'price_per_unit', 'total_cost', 'transaction_date')
    list_filter = ('portfolio', 'transaction_type', 'transaction_date')
    search_fields = ('name', 'symbol')
    ordering = ('-transaction_date',)