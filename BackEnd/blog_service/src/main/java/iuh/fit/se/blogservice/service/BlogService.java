package iuh.fit.se.blogservice.service;

import iuh.fit.se.blogservice.model.Blog;

import java.util.List;
import java.util.Map;

public interface BlogService {
    Map<String, Object> getAllBlogs(Map<String , String> params);
    Blog getBlogById(Long id);
    Blog createBlog(Blog blog);
    Blog updateBlog(Long id, Blog blog);
    void deleteBlog(Long id);

}
