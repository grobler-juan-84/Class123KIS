# 1. Use an official Python runtime as a parent image
FROM python:3.9-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of your application's code into the container
COPY . .

# 5. Tell the container what command to run when it starts
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]