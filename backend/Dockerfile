FROM python:latest

WORKDIR /app

COPY requirement.txt ./
RUN pip install --no-cache-dir --upgrade pip setuptools
RUN pip install django

COPY . .

EXPOSE 8001

# Set the entry point command to run the Django development server
ENTRYPOINT [ "python", "manage.py", "runserver", "0.0.0.0:8001" ]
