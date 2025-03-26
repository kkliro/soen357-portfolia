from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import AccountSerializer
from account.models import Account
from django.shortcuts import get_object_or_404

@api_view(['GET', ])
def account_list(request):
    """
    List all accounts.
    """
    accounts = Account.objects.all()
    serializer = AccountSerializer(accounts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def account_create(request):
    """
    Create a new account.
    """
    serializer = AccountSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def account_detail(request, pk):
    """
    Retrieve a account instance.
    """
    account = get_object_or_404(Account, pk=pk)
    serializer = AccountSerializer(account)
    return Response(serializer.data)

@api_view(['PUT'])
def account_update(request, pk):
    """
    Update a account instance.
    """
    account = get_object_or_404(Account, pk=pk)
    serializer = AccountSerializer(account, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def account_delete(request, pk):
    """
    Delete a account instance.
    """
    account = get_object_or_404(Account, pk=pk)
    account.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)