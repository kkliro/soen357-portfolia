from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from .serializers import TransactionCreateSerializer, TransactionSerializer
from portfolio.models import Portfolio

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def transaction_create(request):
    portfolio = get_object_or_404(Portfolio, id=request.data.get('portfolio'))
    serializer = TransactionCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(portfolio=portfolio)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)