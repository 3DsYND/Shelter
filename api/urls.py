from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
        path('projects/', views.ProjectsListView.as_view(), name='projects_list'),
        path('projects/<int:project_id>/', views.ProjectView.as_view(), name='project'),
        path('projects/<int:project_id>/tasks/', views.TasksListView.as_view(), name='tasks_list'),
        path('projects/<int:project_id>/<int:task_id>/', views.TaskView.as_view(), name='task'),
        ]
