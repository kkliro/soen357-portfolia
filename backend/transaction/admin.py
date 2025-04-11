from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'portfolio', 'transaction_type', 'name', 'symbol', 'quantity', 'price_per_unit', 'total_cost', 'transaction_date')
    list_filter = ('portfolio', 'transaction_type', 'transaction_date')
    search_fields = ('name', 'symbol')
    ordering = ('-transaction_date',)
    # Set the fields explicitly so transaction_date is included on the edit form.
    fields = ('portfolio', 'transaction_type', 'name', 'symbol', 'quantity', 'price_per_unit', 'total_cost', 'transaction_date')
    # Make total_cost read-only because it's computed.
    readonly_fields = ('total_cost',)

    def get_readonly_fields(self, request, obj=None):
        # Ensure transaction_date is not readonly to allow editing.
        ro_fields = list(super().get_readonly_fields(request, obj))
        if 'transaction_date' in ro_fields:
            ro_fields.remove('transaction_date')
        return ro_fields