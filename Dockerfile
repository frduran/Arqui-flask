FROM python:3.5-slim

LABEL maintainer="mandrade2@uc.cl"

USER root

WORKDIR /app

ADD . /app

RUN pip install  -r requirements.txt

EXPOSE 5000

ENV NAME World

# CMD ["gunicorn -k eventlet -w 1" ," module:app"]
CMD ["python" ,"chatapp.py"]