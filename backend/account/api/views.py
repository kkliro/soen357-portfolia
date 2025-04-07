from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from .serializers import AccountCreateSerializer, AccountUpdateSerializer
from account.models import Account
from django.shortcuts import get_object_or_404

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def account_list(request):
    """
    List all accounts (Superuser only).
    """
    accounts = Account.objects.all()
    serializer = AccountCreateSerializer(accounts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def account_create(request):
    """
    Create a new account (No authentication required).
    """
    serializer = AccountCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def account_detail(request):
    """
    Retrieve the authenticated user's account instance.
    """
    account = get_object_or_404(Account, pk=request.user.pk)
    serializer = AccountCreateSerializer(account)
    return Response(serializer.data)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def account_update(request):
    """
    Update the authenticated user's account instance.
    """
    account = get_object_or_404(Account, pk=request.user.pk)
    serializer = AccountUpdateSerializer(account, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def account_delete(request):
    """
    Delete the authenticated user's account instance.
    """
    account = get_object_or_404(Account, pk=request.user.pk)
    account.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)