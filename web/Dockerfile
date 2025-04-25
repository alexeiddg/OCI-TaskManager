# Build stage
FROM maven:3.8.3-openjdk-17 AS builder

# Set working directory
WORKDIR /app

# Copy the parent POM first to leverage build caching
COPY ../pom.xml ./pom.xml

# Copy the lib module
COPY ../lib ./lib

# Copy the web module (current directory)
COPY . ./web

# Build the application
RUN mvn clean package -pl web -am -DskipTests

# Runtime stage
FROM openjdk:17-slim

# Add Oracle client libraries for wallet authentication
RUN apt-get update && apt-get install -y libaio1 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the JAR file from builder stage
COPY --from=builder /app/web/target/*.jar app.jar

# Copy any additional required files for Oracle wallet connectivity if needed
# COPY ./wallet/ /mtdrworkshop/creds/

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
