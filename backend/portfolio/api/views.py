from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from account.models import Account
from strategy.models import Strategy
from .serializers import PortfolioSerializer, PortfolioCreateSerializer, PortfolioUpdateSerializer, PortfolioPerformanceSerializer
from portfolio.models import Portfolio
from transaction.models import Transaction
from portfolio.recommendations import generate_recommendation

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def portfolio_create(request):
    account = get_object_or_404(Account, pk=request.user.pk)
    strategy = get_object_or_404(Strategy, pk=request.data.get('strategy'))
    portfolio = PortfolioCreateSerializer(data=request.data)
    if portfolio.is_valid():
        portfolio.save(account=account, strategy=strategy)
        return Response(portfolio.data, status=status.HTTP_201_CREATED)
    return Response(portfolio.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def portfolio_list(request):
    account = get_object_or_404(Account, pk=request.user.pk)
    portfolios = Portfolio.objects.filter(account=account)
    serializer = PortfolioSerializer(portfolios, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def porfolio_get(request, pk):
    portfolio = get_object_or_404(Portfolio, pk=pk)
    serializer = PortfolioSerializer(portfolio)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def portfolio_update(request, pk):
    portfolio = get_object_or_404(Portfolio, pk=pk)
    serializer = PortfolioUpdateSerializer(portfolio, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def portfolio_delete(request, pk):
    portfolio = get_object_or_404(Portfolio, pk=pk)
    portfolio.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def portfolio_performance(request):
    account = get_object_or_404(Account, pk=request.user.pk)
    portfolios = Portfolio.objects.filter(account=account)
    transactions = Transaction.objects.filter(portfolio__in=portfolios)

    # Pass the queryset as a single instance to the serializer
    serializer = PortfolioPerformanceSerializer(transactions)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def portfolio_recommend(request, pk):
    """
    Endpoint to generate recommendations for a portfolio based on its performance and strategy.
    URL: /portfolio/<id>/recommend
    """
    portfolio = get_object_or_404(Portfolio, pk=pk)
    
    if portfolio.account.pk != request.user.pk:
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
    
    recommendation_data = generate_recommendation(portfolio)
    return Response(recommendation_data, status=status.HTTP_200_OK)