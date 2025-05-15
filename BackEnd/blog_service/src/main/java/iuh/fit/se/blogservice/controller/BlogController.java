package iuh.fit.se.blogservice.controller;

import iuh.fit.se.blogservice.model.Blog;
import iuh.fit.se.blogservice.repository.BlogRepository;
import iuh.fit.se.blogservice.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/blogs")
public class BlogController {
    @Autowired
    private BlogService blogService;
    @Autowired
    private BlogRepository blogRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBlogs(@RequestParam Map<String, String> params) {
        Map<String, Object> response = blogService.getAllBlogs(params);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @PostMapping
    public ResponseEntity<Blog> createBlog(Blog blog) {
        return ResponseEntity.ok(blogService.createBlog(blog));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(Long id, Blog blog) {
        return ResponseEntity.ok(blogService.updateBlog(id, blog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok().build();
    }
}
