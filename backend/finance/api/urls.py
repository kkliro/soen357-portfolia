from django.urls import path
from .views import market_data, stock_info, fetch_stock_view

urlpatterns = [
    path('data/', market_data, name='market-data'),
    path('info/', stock_info, name='stock-info'),
    path('fetch/', fetch_stock_view, name='fetch-stock-data')
]