package iuh.fit.se.blogservice.service;

import iuh.fit.se.blogservice.dto.LikeDTO;

public interface LikeService {
    LikeDTO createLike(Long blogId, Long userId);

    void deleteLike(Long blogId, Long userId);
}
