package iuh.fit.se.blogservice.service;

import iuh.fit.se.blogservice.dto.BlogDTO;
import iuh.fit.se.blogservice.model.Blog;

import java.util.List;
import java.util.Map;

public interface BlogService {
    Map<String, Object> getAllBlogs(Map<String , String> params);
    Blog getBlogById(Long id);
    BlogDTO createBlog(BlogDTO blogDTO);
    BlogDTO updateBlog(Long id, BlogDTO blogDTO);
    void deleteBlog(Long id);

    // get blog by user commented
    Map<String, Object> getBlogsCommentedByUserId(Long userId, Map<String, String> params);

    // get blog by user liked
    Map<String, Object> getBlogsLikedByUserId(Long userId, Map<String, String> params);

}
