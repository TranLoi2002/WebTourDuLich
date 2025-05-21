package iuh.fit.se.blogservice.repository;

import iuh.fit.se.blogservice.dto.BlogDTO;
import iuh.fit.se.blogservice.model.Blog;
import iuh.fit.se.blogservice.model.Comment;
import iuh.fit.se.blogservice.service.LikeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT b FROM Comment c JOIN c.blog b WHERE c.userId = :userId AND c.isActive = true")
    Page<Blog> findBlogsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.blog.id = :blogId")
    Long countByBlogId(@Param("blogId") Long blogId);

    @Query("SELECT c FROM Comment c WHERE c.blog.id = :blogId AND c.parent IS NULL")
    List<Comment> findByBlogIdAndParentIdIsNull(Long blogId);
}
