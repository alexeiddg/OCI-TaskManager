# stage 1: build + repackage the web app (and shared lib)
FROM maven:3.8.3-openjdk-17 AS builder
WORKDIR /build

# 1) copy parent POM and shared-lib
COPY pom.xml .
COPY lib lib

# 2) copy the web module
COPY web web

# 3) compile & repackage web (this will also build lib)
RUN mvn clean package \
    -pl web -am \
    -DskipTests \
    spring-boot:repackage

# stage 2: slim runtime image
FROM openjdk:17-slim
WORKDIR /app

# (optional) include your wallet if you want it baked in:
# COPY ../wallet/ /mtdrworkshop/creds/

# grab the fat JAR
COPY --from=builder /build/web/target/web-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]