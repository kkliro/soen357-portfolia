from decimal import Decimal
from transaction.models import Transaction
from portfolio.api.serializers import IndividualPortfolioPerformanceSerializer

def generate_recommendation(portfolio):
    """
    Generate recommendations by comparing the portfolio's performance with its strategy.
    This version returns all components of the IndividualPortfolioPerformanceSerializer along with
    a recommendation based on the realized gain/loss compared to the strategy's target return.
    """
    transactions = Transaction.objects.filter(portfolio=portfolio)
    serializer = IndividualPortfolioPerformanceSerializer()
    performance_data = serializer.to_representation(transactions)

    realized = performance_data.get("total_gain_loss", {}).get("realized", Decimal(0))
    target = portfolio.strategy.target_return

    recommendation = ""
    if realized < target:
        if portfolio.strategy.risk_tolerance == 'high':
            recommendation = (
                "Your portfolio is underperforming. "
                "Given your high risk tolerance, consider increasing exposure to aggressive, riskier stocks."
            )
        elif portfolio.strategy.risk_tolerance == 'medium':
            recommendation = (
                "Your portfolio is underperforming. "
                "Consider rebalancing with a mix of growth and defensive stocks."
            )
        else: 
            recommendation = (
                "Your portfolio is underperforming. "
                "Focus on stable, dividend-paying stocks to reduce volatility."
            )
    else:
        recommendation = "Your portfolio is on track with your strategy. Consider rebalancing periodically."

    performance_data["recommendation"] = recommendation
    performance_data["realized_gain"] = str(realized)
    performance_data["target_return"] = str(target)

    return performance_data