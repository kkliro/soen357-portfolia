from django.urls import path
from .views import prompt

urlpatterns = [
    path('prompt/', prompt, name='prompt'),
]