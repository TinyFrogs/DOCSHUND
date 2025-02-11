FROM openjdk:21

WORKDIR /usr/src/app

# Python 3.9.13 설치 (Alpine 기반)
RUN apk add --no-cache python3=3.9.13-r0 python3-dev py3-pip build-base \
    && pip3 install --upgrade pip \
    && pip3 install beautifulsoup4==4.12.3

ARG JAR_PATH=./build/libs
ARG JAR_NAME=docshund-0.0.1-SNAPSHOT.jar

COPY ${JAR_PATH}/${JAR_NAME} app.jar

# Spring Boot 실행 (환경에 따라 프로파일 변경 가능)
CMD ["java", "-jar", "-Dspring.profiles.active=local", "app.jar"]
