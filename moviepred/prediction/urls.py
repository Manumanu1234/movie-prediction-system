
from django.urls import path,include
from prediction.views import getMovies
urlpatterns = [
    path('getmovie/',getMovies.as_view())
]
