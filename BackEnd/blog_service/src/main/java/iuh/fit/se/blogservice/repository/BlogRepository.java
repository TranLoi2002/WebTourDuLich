package iuh.fit.se.blogservice.repository;

import iuh.fit.se.blogservice.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog , Long> {
}
