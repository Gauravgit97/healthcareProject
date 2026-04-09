from django.shortcuts import render
from django.http import HttpResponse,JsonResponse


# Create your views here.
def index(request):
    return render(request=request,template_name='index.html')

def general(request):
    return render(request=request,template_name='general.html')

def diabetes(request):
    return render(request=request,template_name='diabetes.html')

def heart(request):
    return render(request=request,template_name='heart.html')