from rest_framework import serializers
from portfolio.models import Portfolio
from transaction.models import Transaction
from finance.helpers import get_stock_info, get_stock_price
from decimal import Decimal
from collections import defaultdict

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = '__all__'

class PortfolioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = '__all__'
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
        gain_data = PortfolioPerformanceSerializer.calculate_owned_assets_gain_loss(transactions)
        total_realized = sum(gain_data["realized"].values())
        total_unrealized = sum(gain_data["unrealized"].values())
        return {
            "realized": total_realized,
            "unrealized": total_unrealized
        }

    @staticmethod
    def calculate_monthly_performance(transactions):
        from collections import defaultdict
        from django.utils.timezone import localtime
        monthly_realized = defaultdict(Decimal)

        owned_assets = defaultdict(list)

        for tx in sorted(transactions, key=lambda t: t.transaction_date):
            month = localtime(tx.transaction_date).strftime('%Y-%m')

            if tx.transaction_type == 'buy':
                owned_assets[tx.symbol].append({
                    'quantity': tx.quantity,
                    'price': tx.price_per_unit,
                    'month': month
                })
            elif tx.transaction_type == 'sell':
                quantity_to_sell = tx.quantity
                sell_price = tx.price_per_unit
                while quantity_to_sell > 0 and owned_assets[tx.symbol]:
                    buy_tx = owned_assets[tx.symbol][0]
                    matched_qty = min(buy_tx['quantity'], quantity_to_sell)
                    realized_gain = matched_qty * (sell_price - buy_tx['price'])
                    monthly_realized[month] += realized_gain

                    buy_tx['quantity'] -= matched_qty
                    quantity_to_sell -= matched_qty
                    if buy_tx['quantity'] == 0:
                        owned_assets[tx.symbol].pop(0)

        return {
            "realized": dict(monthly_realized),
            "unrealized": {} 
        }


    @staticmethod
    def get_investment_types(transactions):
        investment_types = {}
        owned_assets = defaultdict(Decimal) 

        for transaction in transactions:
            if transaction.transaction_type == 'buy':
                owned_assets[transaction.symbol] += transaction.quantity
            elif transaction.transaction_type == 'sell':
                owned_assets[transaction.symbol] -= transaction.quantity

        for symbol, quantity in owned_assets.items():
            if quantity > 0:
                stock_info = get_stock_info(symbol)
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
        owned_assets = defaultdict(list)
        realized = defaultdict(Decimal)
        unrealized = defaultdict(Decimal)

        for tx in sorted(transactions, key=lambda t: t.transaction_date):
            if tx.transaction_type == 'buy':
                owned_assets[tx.symbol].append({
                    'quantity': tx.quantity,
                    'price': tx.price_per_unit,
                    'type': 'buy'
                })
            elif tx.transaction_type == 'sell':
                quantity_to_sell = tx.quantity
                sell_price = tx.price_per_unit
                while quantity_to_sell > 0 and owned_assets[tx.symbol]:
                    buy_tx = owned_assets[tx.symbol][0]
                    matched_qty = min(buy_tx['quantity'], quantity_to_sell)
                    realized_gain = matched_qty * (sell_price - buy_tx['price'])
                    realized[tx.symbol] += realized_gain

                    buy_tx['quantity'] -= matched_qty
                    quantity_to_sell -= matched_qty
                    if buy_tx['quantity'] == 0:
                        owned_assets[tx.symbol].pop(0)

        for symbol, remaining_buys in owned_assets.items():
            current_price = get_stock_price(symbol)
            if current_price is None:
                continue
            current_price = Decimal(current_price)
            for buy in remaining_buys:
                unrealized_gain = buy['quantity'] * (current_price - buy['price'])
                unrealized[symbol] += unrealized_gain

        return {
            "realized": dict(realized),
            "unrealized": dict(unrealized)
        }


    def to_representation(self, instance):
        transactions = instance
        return {
            "total_gain_loss": self.calculate_total_gain_loss(transactions),
            "monthly_performance": self.calculate_monthly_performance(transactions),
            "investment_types": self.get_investment_types(transactions),
            "latest_transactions": self.get_latest_transactions(transactions),
            "assets_by_asset": self.get_assets_by_asset(transactions),
            "owned_assets_gain_loss": self.calculate_owned_assets_gain_loss(transactions),
        }