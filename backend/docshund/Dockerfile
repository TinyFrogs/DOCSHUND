FROM openjdk:21

WORKDIR /usr/src/app

# apt 패키지 관리자 설치 (필수)
RUN apt-get update || true
RUN apt-get install -y apt || true

# Python 3.9.13 설치
RUN apt-get update && apt-get install -y wget && \
    wget https://www.python.org/ftp/python/3.9.13/Python-3.9.13.tgz && \
    tar xzf Python-3.9.13.tgz && \
    cd Python-3.9.13 && \
    apt-get install -y build-essential zlib1g-dev libncurses5-dev \
        libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall && \
    cd .. && rm -rf Python-3.9.13 Python-3.9.13.tgz && \
    apt-get remove -y wget && apt-get autoremove -y

# pip 설치 및 beautifulsoup4 설치
RUN python3.9 -m ensurepip && \
    python3.9 -m pip install --upgrade pip && \
    python3.9 -m pip install beautifulsoup4==4.12.3

ARG JAR_PATH=./build/libs
ARG JAR_NAME=docshund-0.0.1-SNAPSHOT.jar

COPY ${JAR_PATH}/${JAR_NAME} app.jar

# Spring Boot 실행 (환경에 따라 프로파일 변경 가능)
CMD ["java", "-jar", "-Dspring.profiles.active=local", "app.jar"]
