package iuh.fit.se.blogservice.feign;

import iuh.fit.se.blogservice.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVICE", path = "/user")
public interface UserServiceClient {
    @GetMapping("/admin/{id}")
    UserResponse getUserById(@PathVariable("id") Long id);

    @GetMapping("/role/{id}")
    String getUserRoleById(@PathVariable("id") Long id);
}
