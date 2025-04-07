from django.urls import path
from .views import (transaction_create)

urlpatterns = [
    path('transact/', transaction_create, name='transaction-create'),
]