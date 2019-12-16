# Arqui-flask

- Make my life serverless:
Mediante la librería requests se hacen consultas a una instancia del servicio API Gateway de amazon, el que es capaz de interactuar con un servicio Lamba Function de Amazon. En particular, se hacen consultas a las siguientes URI's:
  - https://n2sst0bbr8.execute-api.us-east-1.amazonaws.com/default/testFunction : el botón 'Aleatorio' gatilla una consulta a esta dirección, la que entrega un nombre al azar mediante una lambda function.
  - https://n2sst0bbr8.execute-api.us-east-1.amazonaws.com/default/MyTestFunction : el botón 'Cuéntame un chiste!' gatilla una consulta a esta dirección, la que entrega un chiste al azar mediante una lambda function.