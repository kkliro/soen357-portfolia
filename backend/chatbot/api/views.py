from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta

from .serializers import PromptSerializer
from finance.helpers import fetch_stock_data

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def prompt(request):
    serializer = PromptSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    prompt_text = serializer.validated_data.get('prompt', '').lower()
    messages = []
    
    if ("market" in prompt_text or "index" in prompt_text or "insight" in prompt_text or "analysis" in prompt_text):
        indexes = {
            "S&P 500": "^GSPC",
            "Dow Jones": "^DJI",
            "NASDAQ": "^IXIC",
        }
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=28)
        market_analysis = []
        valid_changes = []
        for label, symbol in indexes.items():
            market_data = fetch_stock_data(symbol, start=str(start_date), end=str(end_date))
            if "error" in market_data:
                market_analysis.append(f"{label}: Data not available.")
            else:
                hist = market_data.get("historical_data", [])
                if hist and len(hist) >= 2 and "Close" in hist[0] and "Close" in hist[-1]:
                    try:
                        start_price = hist[0]["Close"]
                        end_price = hist[-1]["Close"]
                        if start_price and start_price != 0:
                            change_pct = ((end_price - start_price) / start_price) * 100
                            valid_changes.append(change_pct)
                            direction = "up" if change_pct >= 0 else "down"
                            analysis = (f"{label} is {direction} {abs(change_pct):.2f}% over the last 28 days.")
                        else:
                            analysis = f"{label} has insufficient data to compute percentage change."
                    except Exception:
                        analysis = f"{label}: Error computing percentage change."
                else:
                    analysis = f"{label}: Insufficient historical data."
                market_analysis.append(analysis)
        
        messages.append("\n".join(market_analysis))

        if valid_changes:
            avg_change = sum(valid_changes) / len(valid_changes)
            overall = "good" if avg_change >= 0 else "bad"
            messages.append(f"Overall, the market appears {overall} with an average change of {avg_change:.2f}%.")
    
    if "portfolio" in prompt_text and "manage" in prompt_text:
        messages.append("To manage your portfolio, please go to Portfolio Management.")
    
    if "strategy" in prompt_text and "manage" in prompt_text:
        messages.append("To manage your strategy, please go to Strategy Management.")

    if "what are you" in prompt_text:
        messages.append("I am a financial assistant designed to help you with stock market insights and portfolio management.")
 
    if not messages:
        messages.append("I'm sorry, I don't understand the question.")
        
    return Response({"response": "\n\n".join(messages)}, status=status.HTTP_200_OK)