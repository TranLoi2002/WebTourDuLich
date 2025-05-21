package iuh.fit.se.blogservice.service.impl;

import iuh.fit.se.blogservice.dto.LikeDTO;
import iuh.fit.se.blogservice.dto.UserResponse;
import iuh.fit.se.blogservice.feign.UserServiceClient;
import iuh.fit.se.blogservice.model.Blog;
import iuh.fit.se.blogservice.model.Like;
import iuh.fit.se.blogservice.repository.BlogRepository;
import iuh.fit.se.blogservice.repository.LikeRepository;
import iuh.fit.se.blogservice.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeServiceImpl implements LikeService {
    @Autowired
    private LikeRepository  likeRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    @Override
    public LikeDTO createLike(Long blogId, Long userId){
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

        // Kiểm tra user đã like chưa
        if (likeRepository.existsByBlogIdAndUserId(blogId, userId)) {
            throw new IllegalStateException("User has already liked this blog");
        }

        // Tạo Like entity
        Like like = new Like();
        like.setUserId(userId);
        like.setBlog(blog);

        // Lưu Like
        Like savedLike = likeRepository.save(like);

        // Ánh xạ sang LikeDTO
        return mapToLikeDTO(savedLike);
    }

    private LikeDTO mapToLikeDTO(Like like) {
        LikeDTO likeDTO = new LikeDTO();
        likeDTO.setId(like.getId());
        likeDTO.setUserId(like.getUserId());

//        try {
//            UserResponse user = userServiceClient.getUserById(like.getUserId());
//            likeDTO.setUserName(user.getFullName());
//        } catch (Exception e) {
//            likeDTO.setUserName("Unknown User");
//        }

        return likeDTO;
    }

    @Override
    public void deleteLike(Long blogId, Long userId) {
        // Kiểm tra xem Like có tồn tại không
        Like like = likeRepository.findByBlogIdAndUserId(blogId, userId)
                .orElseThrow(() -> new RuntimeException("Like not found for blogId: " + blogId + " and userId: " + userId));

        // Xóa Like
        likeRepository.delete(like);
    }
}
