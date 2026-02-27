from django.urls import path

from . import views

urlpatterns = [
    path('logfile/', views.LogFileView.as_view(), name='log_viewer_logfile'),
    path('api/logcontents/', views.get_logs, name='log_viewer_get_logs'),
]
