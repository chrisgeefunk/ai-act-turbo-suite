FROM python:3.11-slim
WORKDIR /app
COPY ../../packages/shared-lib-py /app/packages/shared-lib-py
COPY ./main.py /app/main.py
RUN pip install fastapi uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
