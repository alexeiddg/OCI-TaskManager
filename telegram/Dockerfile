# stage 1: build + repackage Telegram (and shared lib)
FROM maven:3.8.3-openjdk-17 AS builder
WORKDIR /build

# copy only what we need (parent POM, shared lib, telegram module)
COPY pom.xml .
COPY lib lib
COPY telegram telegram

# build parent + lib + telegram and explicitly repackage
RUN mvn clean package \
    -pl telegram -am \
    -DskipTests \
    spring-boot:repackage

# stage 2: runtime image
FROM openjdk:17-slim
WORKDIR /app

# optional: bring in wallet if you want it baked in
# COPY ../wallet/ /mtdrworkshop/creds/

# grab the repackaged Telegram JAR
COPY --from=builder /build/telegram/target/telegram-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]