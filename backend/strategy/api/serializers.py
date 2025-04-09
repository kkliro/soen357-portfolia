from rest_framework import serializers
from strategy.models import Strategy

class StrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'account']

class StrategyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'account']

class StrategyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
        fields = ['name', 'risk_tolerance', 'investment_type', 'target_return', 'investment_horizon', 'diversification_level', 'automated_trading']