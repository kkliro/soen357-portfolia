from django.urls import path
from .views import strategy_create, strategy_list, strategy_get, strategy_update, strategy_delete

urlpatterns = [
    path('create/', strategy_create, name='strategy-create'),
    path('list/', strategy_list, name='strategy-list'),
    path('<int:pk>/get/', strategy_get, name='strategy-get'),
    path('<int:pk>/update/', strategy_update, name='strategy-update'),
    path('<int:pk>/delete/', strategy_delete, name='strategy-delete'),
]