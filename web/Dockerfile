FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/web-0.0.1-SNAPSHOT.jar web-app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "web-app.jar"]