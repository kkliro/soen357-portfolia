from django.urls import path
from .views import (account_create, account_list, account_detail, account_update, account_delete)

urlpatterns = [
    path('', account_list, name='account-list'),
    path('create/', account_create, name='account-create'),
    path('<int:pk>/', account_detail, name='account-detail'),
    path('<int:pk>/update/', account_update, name='account-update'),
    path('<int:pk>/delete/', account_delete, name='account-delete'),
]