FROM docker.io/library/openjdk:17-slim

WORKDIR /app

COPY web/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]