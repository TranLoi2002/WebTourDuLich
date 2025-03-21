FROM ubuntu:latest
LABEL authors="tranvanloi"

ENTRYPOINT ["top", "-b"]

# Sử dụng base image OpenJDK 17
FROM openjdk:17-jdk-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file JAR của ứng dụng vào container
COPY target/*.jar app.jar

# Expose cổng 8080 để ứng dụng Spring Boot hoạt động
EXPOSE 8080

# Chạy ứng dụng Spring Boot khi container khởi động
CMD ["java", "-jar", "app.jar"]