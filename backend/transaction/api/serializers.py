from decimal import Decimal
from rest_framework import serializers
from transaction.models import Transaction
from finance.helpers import get_stock_price, get_stock_info 

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['portfolio', 'transaction_type', 'symbol', 'quantity']
        read_only_fields = ['id', 'transaction_date', 'price_per_unit', 'total_cost', 'name']

    def create(self, validated_data):
        symbol = validated_data.get('symbol')
        price = get_stock_price(symbol)
        if price is None:
            raise serializers.ValidationError(f"Unable to fetch stock price for symbol: {symbol}")

        validated_data['price_per_unit'] = Decimal(str(price))

        info = get_stock_info(symbol)
        validated_data['name'] = info.get('shortName') or symbol

        return super().create(validated_data)