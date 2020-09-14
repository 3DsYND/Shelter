from rest_framework import generics
from rest_framework import exceptions

from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer


class ProjectsListView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    def get_object(self):
        return Project.objects.get(pk=self.kwargs["project_id"])

class TasksListView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    def get_queryset(self):
        return Task.objects.filter(project=self.kwargs["project_id"])

    def create(self, request, *args, **kwargs):
        request.data.update({"project": self.kwargs["project_id"]})
        return super().create(request, *args, **kwargs)

class TaskView(generics.RetrieveUpdateDestroyAPIView):
    def get_object(self):
        try:
            return Task.objects.get(pk=self.kwargs["task_id"], project=self.kwargs["project_id"])
        except Task.DoesNotExist:
            raise exceptions.NotFound
    serializer_class = TaskSerializer
