package iuh.fit.se.reviewservice.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dzwjgfd7t",
                "api_key", "526411628189671",
                "api_secret", "ZtrL-STYHdMSCxaASgrQ1RGrUUY"
        ));
    }
}
