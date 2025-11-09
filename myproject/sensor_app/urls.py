from django.urls import path, re_path
from . import views

urlpatterns = [
        # ... your existing API routes ...
        re_path(r'^.*$', views.index, name='index'),  # catch-all route for React
]
