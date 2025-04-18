from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include('account.api.urls')),
    path('auth/', include('authentication.api.urls')),
    path('strategy/', include('strategy.api.urls')),
    path('portfolio/', include('portfolio.api.urls')),
    path('transaction/', include('transaction.api.urls')),
    path('finance/', include('finance.api.urls')),
    path('chatbot/', include('chatbot.api.urls')),
]
