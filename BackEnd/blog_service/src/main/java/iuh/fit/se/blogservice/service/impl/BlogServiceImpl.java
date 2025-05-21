package iuh.fit.se.blogservice.service.impl;

import iuh.fit.se.blogservice.dto.BlogDTO;
import iuh.fit.se.blogservice.dto.CommentDTO;
import iuh.fit.se.blogservice.dto.LikeDTO;
import iuh.fit.se.blogservice.dto.UserResponse;
import iuh.fit.se.blogservice.feign.UserServiceClient;
import iuh.fit.se.blogservice.model.Blog;
import iuh.fit.se.blogservice.model.Category;
import iuh.fit.se.blogservice.model.Comment;
import iuh.fit.se.blogservice.model.Status;
import iuh.fit.se.blogservice.repository.BlogRepository;
import iuh.fit.se.blogservice.repository.CategoryRepository;
import iuh.fit.se.blogservice.repository.CommentRepository;
import iuh.fit.se.blogservice.repository.LikeRepository;
import iuh.fit.se.blogservice.service.BlogService;
import iuh.fit.se.blogservice.utils.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BlogServiceImpl implements BlogService {
    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserServiceClient userServiceClient;


    @Override
    public Map<String, Object> getAllBlogs(Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<Blog> page = blogRepository.findAll(pageable);

        // Ánh xạ từ Blog sang BlogDTO
        Page<BlogDTO> dtoPage = page.map(this::mapToDTO);

        return PaginationUtil.createResponse(dtoPage);
    }

    @Override
    public BlogDTO getBlogById(Long id) {
        // Tìm bài đăng theo ID, đảm bảo chưa bị xóa mềm
        Blog blog = blogRepository.findByIdAndActive(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id " + id));

        // Ánh xạ Blog entity sang BlogDTO
        return mapToDTO(blog);
    }

    @Override
    public BlogDTO createBlog(BlogDTO blogDTO) {
        Category category = categoryRepository.findById(blogDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id " + blogDTO.getCategoryId()));

        String categoryName = category.getName();

        // Ánh xạ BlogDTO sang Blog entity
        Blog blog = new Blog();
        blog.setTitle(blogDTO.getTitle());
        blog.setContent(blogDTO.getContent());
        blog.setThumbnail(blogDTO.getThumbnail());

        // Kiểm tra category
        if ("News".equalsIgnoreCase(categoryName)) {
            if (blogDTO.getExternal_url() == null || blogDTO.getExternal_url().isEmpty()) {
                throw new IllegalArgumentException("External URL is required for category 'news'");
            }
            blog.setExternal_url(blogDTO.getExternal_url());
        } else {
            blogDTO.setExternal_url(null); // Xóa external_url nếu không phải "news"
        }

        blog.setAuthorId(blogDTO.getAuthorId());
        blog.setCategory(category);
        blog.setStatus(Status.PUBLISHED);


        // Lưu Blog vào cơ sở dữ liệu
        Blog savedBlog = blogRepository.save(blog);

        // Ánh xạ Blog entity sang BlogDTO để trả về
        return mapToDTO(savedBlog);
    }

    public BlogDTO mapToDTO(Blog blog) {
        BlogDTO blogDTO = new BlogDTO();
        blogDTO.setId(blog.getId());
        blogDTO.setTitle(blog.getTitle());
        blogDTO.setContent(blog.getContent());
        blogDTO.setThumbnail(blog.getThumbnail());
        blogDTO.setExternal_url(blog.getExternal_url());
        blogDTO.setAuthorId(blog.getAuthorId());

        // Fetch author details
        try {
            UserResponse user = userServiceClient.getUserById(blog.getAuthorId());
            blogDTO.setAuthorName(user.getFullName());
            blogDTO.setAuthorAvatar(user.getAvatar());
        } catch (Exception e) {
            blogDTO.setAuthorName("Unknown Author");
            blogDTO.setAuthorAvatar(null);
        }

        // Map category details
        blogDTO.setCategoryId(blog.getCategory().getId());
        blogDTO.setCategoryName(blog.getCategory().getName());

        // Count comments
        blogDTO.setCommentCount((long) Optional.ofNullable(blog.getComments()).orElse(Collections.emptyList()).size());

        // Map comments and replies
        List<CommentDTO> commentDTOs = blog.getComments().stream()
                .filter(comment -> comment.getParent() == null) // Only include parent comments
                .map(this::mapToDTOWithReplies) // Map parent comments with their replies
                .collect(Collectors.toList());
        blogDTO.setComments(commentDTOs);

        // Count likes
        blogDTO.setLikeCount((long) Optional.ofNullable(blog.getLikes()).orElse(Collections.emptyList()).size());

        // Map likes
        List<LikeDTO> likeDTOs = blog.getLikes().stream().map(like -> {
            LikeDTO likeDTO = new LikeDTO();
            likeDTO.setId(like.getId());
            likeDTO.setUserId(like.getUserId());
            return likeDTO;
        }).collect(Collectors.toList());
        blogDTO.setLikes(likeDTOs);

        // Map status
        blogDTO.setStatus(blog.getStatus() != null ? blog.getStatus().name() : null);

        // Map timestamps
        blogDTO.setCreatedAt(blog.getCreatedAt() != null ? blog.getCreatedAt().toString() : null);
        blogDTO.setUpdatedAt(blog.getUpdatedAt() != null ? blog.getUpdatedAt().toString() : null);

        //active
        blogDTO.setActive(blog.isActive());
        return blogDTO;
    }

    // map comment to commentDTO have user name and avatar
    private CommentDTO mapToDTOWithReplies(Comment comment) {
        CommentDTO dto = new CommentDTO(comment);

        // Fetch user details
        try {
            UserResponse user = userServiceClient.getUserById(comment.getUserId());
            dto.setUserName(user.getFullName());
            dto.setUserAvatar(user.getAvatar());
        } catch (Exception e) {
            dto.setUserName("Unknown User");
            dto.setUserAvatar(null);
        }

        // Map replies recursively
        dto.setReplies(Optional.ofNullable(comment.getReplies())
                .orElse(Collections.emptyList())
                .stream()
                .map(this::mapToDTOWithReplies)
                .collect(Collectors.toList()));

        return dto;
    }

    @Override
    public BlogDTO updateBlog(Long id, BlogDTO blogDTO) {
        // Tìm bài đăng theo ID, đảm bảo chưa bị xóa mềm
        Blog blog = blogRepository.findByIdAndActive(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id " + id));

        // Kiểm tra danh mục nếu được cung cấp
        if (blogDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(blogDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + blogDTO.getCategoryId()));
            blog.setCategory(category);
        }

        // Cập nhật các trường từ BlogDTO
        if (blogDTO.getTitle() != null) {
            blog.setTitle(blogDTO.getTitle());
        }
        if (blogDTO.getContent() != null) {
            blog.setContent(blogDTO.getContent());
        }
        if (blogDTO.getThumbnail() != null) {
            blog.setThumbnail(blogDTO.getThumbnail());
        }


        // Kiểm tra category
        if ("news".equalsIgnoreCase(blogDTO.getCategoryName())) {
            if (blogDTO.getExternal_url() == null || blogDTO.getExternal_url().isEmpty()) {
                throw new IllegalArgumentException("External URL is required for category 'news'");
            }
            blog.setExternal_url(blogDTO.getExternal_url());
        } else {
            blog.setExternal_url(null); // Xóa external_url nếu không phải "news"
        }

        if (blogDTO.getStatus() != null) {
            try {
                blog.setStatus(Status.valueOf(blogDTO.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid blog status: " + blogDTO.getStatus());
            }
        }

        // Cập nhật updatedAt
        blog.setUpdatedAt(LocalDateTime.now());

        // Lưu bài đăng đã cập nhật
        Blog updatedBlog = blogRepository.save(blog);

        // Ánh xạ sang BlogDTO để trả về
        return mapToDTO(updatedBlog);
    }

    @Override
    public void deleteBlog(Long id) {
        // Tìm bài đăng theo ID, đảm bảo chưa bị xóa mềm
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id " + id));
        if (blog != null) {
            if(blog.isActive()){
                blog.setActive(false);
            }else{
                blog.setActive(true);
            }
            blog.setUpdatedAt(LocalDateTime.now());
            blogRepository.save(blog);
        } else {
            throw new RuntimeException("Blog not found with id " + id);
        }
    }

    @Override
    public Map<String, Object> getBlogsCommentedByUserId(Long userId, Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<Blog> blogs = commentRepository.findBlogsByUserId(userId, pageable);
        Page<BlogDTO> blogDTOs = blogs.map(blog -> mapToDTO(blog));

        return PaginationUtil.createResponse(blogDTOs);
    }

    @Override
    public Map<String, Object> getBlogsLikedByUserId(Long userId, Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<Blog> blogs = likeRepository.findBlogsByUserId(userId, pageable);
        Page<BlogDTO> blogDTOs = blogs.map(blog -> mapToDTO(blog));

        return PaginationUtil.createResponse(blogDTOs);
    }

    @Override
    public Map<String, Object> getBlogsByCategoryId(Long categoryId, Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<Blog> blogs = blogRepository.findByCategoryId(categoryId, pageable);
        Page<BlogDTO> blogDTOs = blogs.map(blog -> mapToDTO(blog));

        return PaginationUtil.createResponse(blogDTOs);
    }
}
