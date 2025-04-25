FROM maven:3.8.3-openjdk-17 AS builder
WORKDIR /build
COPY . .
RUN mvn clean package -pl web -am -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=builder /build/web/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]