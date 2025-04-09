from rest_framework import serializers
from portfolio.models import Portfolio
from transaction.models import Transaction
from finance.helpers import get_stock_info, get_stock_price
from decimal import Decimal

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

class PortfolioPerformanceSerializer(serializers.Serializer):
    total_gain_loss = serializers.DecimalField(max_digits=20, decimal_places=8)
    monthly_performance = serializers.DictField(child=serializers.DecimalField(max_digits=20, decimal_places=8))
    investment_types = serializers.DictField(child=serializers.IntegerField())
    latest_transactions = serializers.ListField(child=serializers.DictField())
    assets_by_asset = serializers.DictField(child=serializers.DecimalField(max_digits=20, decimal_places=8))
    owned_assets_gain_loss = serializers.DictField(child=serializers.DecimalField(max_digits=20, decimal_places=8))  # New field

    @staticmethod
    def calculate_total_gain_loss(transactions):
        from django.utils.timezone import localtime
        total_gain_loss = Decimal(0)
    
        for transaction in transactions:
            transaction_date = localtime(transaction.transaction_date).date()
            market_price = get_stock_price(transaction.symbol)  # Fetch the market price
    
            if market_price is not None:
                market_price = Decimal(market_price)  # Convert to Decimal for consistency
                if transaction.transaction_type == 'buy':
                    # Use the market price at the time of the transaction
                    total_gain_loss -= transaction.quantity * market_price
                elif transaction.transaction_type == 'sell':
                    # Use the market price at the time of the transaction
                    total_gain_loss += transaction.quantity * market_price
    
        return total_gain_loss

    @staticmethod
    def calculate_monthly_performance(transactions):
        from collections import defaultdict
        from django.utils.timezone import localtime
        monthly_performance = defaultdict(lambda: Decimal(0))
    
        for transaction in transactions:
            month = localtime(transaction.transaction_date).strftime('%Y-%m')
            market_price = get_stock_price(transaction.symbol)  # Fetch the market price
    
            if market_price is not None:
                market_price = Decimal(market_price)  # Convert to Decimal for consistency
                if transaction.transaction_type == 'buy':
                    # Subtract the cost based on the market price
                    monthly_performance[month] -= transaction.quantity * market_price
                elif transaction.transaction_type == 'sell':
                    # Add the revenue based on the market price
                    monthly_performance[month] += transaction.quantity * market_price
    
        return dict(monthly_performance)

    @staticmethod
    def get_investment_types(transactions):
        investment_types = {}
        for transaction in transactions:
            stock_info = get_stock_info(transaction.symbol)
            investment_type = stock_info.get('type', 'Unknown')
            investment_types[investment_type] = investment_types.get(investment_type, 0) + 1
        return investment_types

    @staticmethod
    def get_latest_transactions(transactions):
        latest_transactions = sorted(transactions, key=lambda t: t.transaction_date, reverse=True)[:5]
        return [
            {
                "transaction_type": t.transaction_type,
                "name": t.name,
                "symbol": t.symbol,
                "quantity": t.quantity,
                "price_per_unit": t.price_per_unit,
                "total_cost": t.total_cost,
                "transaction_date": t.transaction_date,
            }
            for t in latest_transactions
        ]

    @staticmethod
    def get_assets_by_asset(transactions):
        from collections import defaultdict
        assets_by_asset = defaultdict(lambda: 0)
        for transaction in transactions:
            if transaction.transaction_type == 'buy':
                assets_by_asset[transaction.symbol] += transaction.quantity
            elif transaction.transaction_type == 'sell':
                assets_by_asset[transaction.symbol] -= transaction.quantity
        return dict(assets_by_asset)

    @staticmethod
    def calculate_owned_assets_gain_loss(transactions):
        from collections import defaultdict
        owned_assets = defaultdict(lambda: {"quantity": Decimal(0), "total_cost": Decimal(0)})
        gain_loss = {}

        # Aggregate owned assets
        for transaction in transactions:
            if transaction.transaction_type == 'buy':
                owned_assets[transaction.symbol]["quantity"] += transaction.quantity
                owned_assets[transaction.symbol]["total_cost"] += transaction.total_cost
            elif transaction.transaction_type == 'sell':
                owned_assets[transaction.symbol]["quantity"] -= transaction.quantity
                owned_assets[transaction.symbol]["total_cost"] -= transaction.total_cost

        # Calculate gain/loss for owned assets
        for symbol, data in owned_assets.items():
            if data["quantity"] > 0:  # Only consider assets still owned
                current_price = get_stock_price(symbol)
                if current_price is not None:
                    current_price = Decimal(current_price)  # Convert float to Decimal
                    market_value = data["quantity"] * current_price
                    gain_loss[symbol] = market_value - data["total_cost"]

        return gain_loss

    def to_representation(self, instance):
        transactions = instance
        return {
            "total_gain_loss": self.calculate_total_gain_loss(transactions),
            "monthly_performance": self.calculate_monthly_performance(transactions),
            "investment_types": self.get_investment_types(transactions),
            "latest_transactions": self.get_latest_transactions(transactions),
            "assets_by_asset": self.get_assets_by_asset(transactions),
            "owned_assets_gain_loss": self.calculate_owned_assets_gain_loss(transactions),  # New field
        }