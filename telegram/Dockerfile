FROM maven:3.8.3-openjdk-17 AS builder
WORKDIR /build

COPY . .

# Build only telegram + its dependencies
RUN mvn clean package -pl telegram -am -DskipTests

FROM docker.io/library/openjdk:17-slim AS runtime
WORKDIR /app
COPY --from=builder /build/telegram/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]