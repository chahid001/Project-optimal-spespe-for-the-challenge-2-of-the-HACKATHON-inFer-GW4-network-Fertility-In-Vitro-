from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


from bio import models


@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        # Save the uploaded file
        instance = models.UploadedFile(file=uploaded_file)
        instance.save()
        file_name = instance.file.name
        options = request.GET.getlist('options[]', [])
        models.check_data(file_name, options)
        path = models.var_name
        return JsonResponse({'success': True, 'message': 'File uploaded successfully', 'path': path})
    else:
        return JsonResponse({'success': False, 'message': 'No file provided'}, status=400)

@api_view(['POST'])
def send_file_path(request):
    if request.method == 'POST':
        file_path = request.data.get('file_path')
        # Here you can perform any additional processing
        return Response({'file_path': file_path})


