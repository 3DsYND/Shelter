from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=200, default="New project")

    def __str__(self):
        return self.title


class Task(models.Model):
    title = models.CharField(max_length=200, default="New project")
    #order = models.IntegerField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
