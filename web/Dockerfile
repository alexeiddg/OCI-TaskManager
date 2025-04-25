FROM docker.io/library/openjdk:17-slim

WORKDIR /app

COPY telegram/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]