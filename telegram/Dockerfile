FROM openjdk:17-jdk-slim
WORKDIR /app

# copy your built Spring Boot fat-jar
COPY target/telegram-0.0.1-SNAPSHOT.jar telegram-app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","telegram-app.jar"]