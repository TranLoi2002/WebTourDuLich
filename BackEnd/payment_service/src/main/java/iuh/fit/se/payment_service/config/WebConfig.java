package iuh.fit.se.payment_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Cho phép tất cả API bắt đầu bằng "/api"
                .allowedOrigins("http://localhost:3000") // URL của ReactJS
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE") // Các phương thức HTTP cho phép
                .allowedHeaders("*") // Cho phép tất cả headers
                .allowCredentials(true); // Cho phép gửi cookie (nếu cần)
    }
}