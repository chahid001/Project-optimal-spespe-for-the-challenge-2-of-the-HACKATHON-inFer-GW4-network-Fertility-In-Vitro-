from django.shortcuts import render
from django.http import JsonResponse
from .models import UploadedFile
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        # Save the uploaded file
        instance = UploadedFile(file=uploaded_file)
        instance.save()
        return JsonResponse({'success': True, 'message': 'File uploaded successfully'})
    else:
        return JsonResponse({'success': False, 'message': 'No file provided'}, status=400)

