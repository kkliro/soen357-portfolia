from rest_framework import serializers
from portfolio.models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = '__all__'

class PortfolioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['name', 'account', 'strategy', 'description', 'strategy', 'currency', 'created_at']
        read_only_fields = ['id', 'account', 'created_at', 'updated_at']

class PortfolioUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['name', 'account', 'strategy', 'description', 'strategy', 'currency', 'updated_at']
        read_only_fields = ['id', 'account', 'created_at', 'updated_at']