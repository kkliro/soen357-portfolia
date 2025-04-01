from django.urls import path
from .views import (portfolio_create, 
                    portfolio_list, 
                    porfolio_get, 
                    portfolio_update, 
                    portfolio_delete)

urlpatterns = [
    path('create/', portfolio_create, name='portfolios-create'),
    path('list/', portfolio_list, name='portfolios-list'),
    path('<int:pk>/get', porfolio_get, name='portfolios-get'),
    path('<int:pk>/update', portfolio_update, name='portfolios-update'),
    path('<int:pk>/delete', portfolio_delete, name='portfolios-delete'),
]