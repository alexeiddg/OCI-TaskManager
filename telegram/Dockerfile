FROM openjdk:17-jdk-slim
WORKDIR /app

# copy your built Spring Boot fat-jar
COPY target/web-0.0.1-SNAPSHOT.jar web-app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","web-app.jar"]