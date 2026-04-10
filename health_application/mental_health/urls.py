from django.urls import path
from . import views

urlpatterns = [
    path('',views.index,name='index'),
    path('index/',views.index,name='index'),
    path('general/', views.general, name='general'),
    path('diabetes/', views.diabetes, name='diabetes'),
    path('heart/', views.heart, name='heart'),

]