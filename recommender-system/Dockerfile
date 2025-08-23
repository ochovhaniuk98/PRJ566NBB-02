FROM python:3.12.10

COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY ./app.py ./app.py
COPY ./routes/ ./routes/

ENTRYPOINT ["python3", "app.py"]