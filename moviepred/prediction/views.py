from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import difflib 
from sklearn.feature_extraction.text import TfidfVectorizer
import os
from django.conf import settings
class getMovies(APIView):
    def get(self,request):
        ok=request.query_params['testData']
        media_folder = settings.MEDIA_ROOT  # Ensure settings.MEDIA_ROOT is defined
        csv_file = os.path.join(media_folder, 'movies.csv')
    
        try:
          df = pd.read_csv(csv_file)
          print(df.head())  # Print the first few rows to verify it's read correctly
        except Exception as e:
          print(f"Error reading the CSV file: {e}")
    

        #df=pd.read_csv(csv_file)
        list_of_required=['genres','keywords','tagline','cast','director']
        for movies in list_of_required:
            df[movies]=df[movies].fillna('');
        combined_data=df['genres']+' '+df['keywords']+' '+df['tagline']+' '+df['cast']+' '+df['director']
          
        vectorizer=TfidfVectorizer()
        combined_data_numerical=vectorizer.fit_transform(combined_data) 
        similarize=cosine_similarity(combined_data_numerical)
        list_of_titles=df['title'].tolist()
        find_close_match=difflib.get_close_matches(ok,list_of_titles)
    
        find_close_match=find_close_match[0]
        index_of_closestmovie=df[df.title==find_close_match]['index'].values[0]
        similarity_score=list(enumerate(similarize[index_of_closestmovie]))
        soreted_score=sorted(similarity_score,key=lambda x:x[1],reverse=True)
        i=1;
        movielist=[]
        for movies in soreted_score:
            movie=movies[0]
            moviedata=df[df.index==movie]['id'].values[0]
            if i>=15:
                break;
            movielist.append(moviedata)
            i=i+1
        
        return Response({"data":movielist})