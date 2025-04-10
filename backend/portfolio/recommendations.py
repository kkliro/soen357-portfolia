from datetime import datetime, timedelta
from decimal import Decimal
from transaction.models import Transaction
from portfolio.api.serializers import IndividualPortfolioPerformanceSerializer
from finance.helpers import get_stock_news, get_stock_price, get_stock_history

def generate_recommendation(portfolio):
    """
    Generate recommendations by comparing the portfolio's performance with its strategy.
    For each owned stock (derived from assets_by_asset), this version analyzes quantitative data by comparing 
    the current price to the average price over the last week and performs rudimentary qualitative analysis from recent news.
    """
    transactions = Transaction.objects.filter(portfolio=portfolio)
    serializer = IndividualPortfolioPerformanceSerializer()
    performance_data = serializer.to_representation(transactions)

    realized = performance_data.get("total_gain_loss", {}).get("realized", Decimal(0))
    target = portfolio.strategy.target_return

    if realized < target:
        if portfolio.strategy.risk_tolerance == 'high':
            overall_recommendation = (
                "Your portfolio is underperforming. "
                "Given your high risk tolerance, consider increasing exposure to aggressive, riskier stocks."
            )
        elif portfolio.strategy.risk_tolerance == 'medium':
            overall_recommendation = (
                "Your portfolio is underperforming. "
                "Consider rebalancing with a mix of growth and defensive stocks."
            )
        else:
            overall_recommendation = (
                "Your portfolio is underperforming. "
                "Focus on stable, dividend-paying stocks to reduce volatility."
            )
    else:
        overall_recommendation = "Your portfolio is on track with your strategy. Consider rebalancing periodically."

    performance_data["recommendation"] = overall_recommendation
    performance_data["realized_gain"] = str(realized)
    performance_data["target_return"] = str(target)

    stocks_analysis = []
    assets = performance_data.get("assets_by_asset", {})
    for symbol in assets.keys():
        current_price = get_stock_price(symbol)
        end_date = datetime.today().date()
        start_date = end_date - timedelta(days=7)
        history_data = get_stock_history(symbol, start_date.isoformat(), end_date.isoformat())
        average_price = None
        if history_data:
            prices = [record.get("Close") for record in history_data if record.get("Close") is not None]
            if prices:
                average_price = sum(prices) / len(prices)
        
        if current_price is not None and average_price is not None:
            if current_price > average_price:
                quant_recommendation = "Bullish trend observed."
            else:
                quant_recommendation = "Bearish trend observed."
        else:
            quant_recommendation = "Insufficient data to determine trend."

        all_news = get_stock_news(symbol)
        negative_keywords = ["downgrade", "warning", "risk", "loss"]
        qualitative_flag = any(
            any(neg in article.get("title", "").lower() for neg in negative_keywords)
            for article in all_news
        )
        if qualitative_flag:
            qualitative_recommendation = "Recent news signals potential concerns."
        else:
            if all_news:
                qualitative_recommendation = "Recent news appears positive."
            else:
                qualitative_recommendation = "No recent news to analyze."

        display_news = all_news[:2]

        stock_rec = {
            "symbol": symbol,
            "current_price": current_price,
            "average_price_last_week": average_price,
            "quantitative_assessment": quant_recommendation,
            "news": display_news,
            "qualitative_assessment": qualitative_recommendation
        }
        stocks_analysis.append(stock_rec)

    performance_data["stocks_analysis"] = stocks_analysis

    return performance_data