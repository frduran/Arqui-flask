FROM python:3.6.5

WORKDIR /code
COPY * /code/
RUN pip install -r requirements.txt