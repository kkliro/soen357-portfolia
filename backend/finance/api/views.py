from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import MarketDataQuerySerializer, StockInfoQuerySerializer
from finance.helpers import get_stock_history, get_stock_info, fetch_stock_data

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def market_data(request):
    serializer = MarketDataQuerySerializer(data=request.data)
    if serializer.is_valid():
        symbol = serializer.validated_data['symbol']
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        data = get_stock_history(symbol, start_date, end_date)
        if data is None:
            return Response({"error": "No data found for the given parameters."},
                            status=status.HTTP_404_NOT_FOUND)
        return Response(data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def stock_info(request):
    serializer = StockInfoQuerySerializer(data=request.data)
    if serializer.is_valid():
        symbol = serializer.validated_data['symbol']
        info = get_stock_info(symbol)
        return Response(info, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def fetch_stock_view(request):
    serializer = MarketDataQuerySerializer(data=request.data)
    if serializer.is_valid():
        symbol = serializer.validated_data['symbol']
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        data = fetch_stock_data(symbol, start_date, end_date)
        if "error" in data:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)