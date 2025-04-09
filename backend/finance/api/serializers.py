from rest_framework import serializers

class MarketDataQuerySerializer(serializers.Serializer):
    symbol = serializers.CharField(max_length=10)
    start_date = serializers.DateField()
    end_date = serializers.DateField()

class StockInfoQuerySerializer(serializers.Serializer):
    symbol = serializers.CharField(max_length=10)