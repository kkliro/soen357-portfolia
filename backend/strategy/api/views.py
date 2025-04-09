from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from account.models import Account
from .serializers import StrategyCreateSerializer, StrategyUpdateSerializer, StrategySerializer
from strategy.models import Strategy

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def strategy_create(request):
    account = get_object_or_404(Account, pk=request.user.pk)
    strategy = StrategyCreateSerializer(data=request.data)
    if strategy.is_valid():
        strategy.save(account=account)
        return Response(strategy.data, status=status.HTTP_201_CREATED)
    return Response(strategy.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def strategy_list(request):
    account = get_object_or_404(Account, pk=request.user.pk)
    strategy = Strategy.objects.filter(account=account)
    serializer = StrategySerializer(strategy, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def strategy_get(request, pk):
    account = get_object_or_404(Account, pk=request.user.pk)
    strategy = get_object_or_404(Strategy, pk=pk, account=account)
    serializer = StrategySerializer(strategy)
    return Response(serializer.data)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def strategy_update(request, pk):
    account = get_object_or_404(Account, pk=request.user.pk)
    strategy = get_object_or_404(Strategy, pk=pk, account=account)
    serializer = StrategyUpdateSerializer(strategy, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def strategy_delete(request, pk):
    account = get_object_or_404(Account, pk=request.user.pk)
    strategy = get_object_or_404(Strategy, pk=pk, account=account)
    strategy.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)