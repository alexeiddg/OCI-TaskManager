# Build stage
FROM maven:3.8.3-openjdk-17 AS builder

# Set build context to /build
WORKDIR /build

# Copy the parent POM and project structure
COPY pom.xml ./
COPY lib ./lib
COPY telegram ./telegram

# Compile only the telegram service and its dependencies
RUN mvn clean package -pl telegram -am -DskipTests -Dmaven.test.skip=true

# Runtime stage
FROM openjdk:17-slim

# Install Oracle client libraries if needed
RUN apt-get update \
    && apt-get install -y libaio1 \
    && rm -rf /var/lib/apt/lists/*

# Prepare application directory
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /build/telegram/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Launch the application
ENTRYPOINT ["java", "-jar", "app.jar"]