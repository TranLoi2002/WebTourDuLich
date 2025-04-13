package iuh.fit.se.blogservice.service.impl;

import iuh.fit.se.blogservice.model.Blog;
import iuh.fit.se.blogservice.repository.BlogRepository;
import iuh.fit.se.blogservice.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogServiceImpl implements BlogService {
    @Autowired
    private BlogRepository blogRepository;


    @Override
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    @Override
    public Blog getBlogById(Long id) {
        return blogRepository.findById(id).orElse(null);
    }

    @Override
    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    @Override
    public Blog updateBlog(Long id, Blog blog) {
        return blogRepository.findById(id)
                .map(oldBlog -> {
                    oldBlog.setTitle(blog.getTitle());
                    oldBlog.setContent(blog.getContent());
                    oldBlog.setThumbnail(blog.getThumbnail());
                    return blogRepository.save(oldBlog);
                }).orElseThrow(() -> new RuntimeException("Blog not found with id " + id));
    }

    @Override
    public void deleteBlog(Long id) {
        Blog blog = getBlogById(id);
        if (blog != null) {
            blog.setActive(false);
            blogRepository.save(blog);
        } else {
            throw new RuntimeException("Blog not found with id " + id);
        }
    }
}
