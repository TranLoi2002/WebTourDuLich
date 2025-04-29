package iuh.fit.se.blogservice.utils;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Map;

public class PaginationUtil {
    public static Pageable createPageable(Map<String, String> params) {
        int page = Integer.parseInt(params.getOrDefault("page", "0"));
        int size = Integer.parseInt(params.getOrDefault("size", "10"));
        String sortBy = params.getOrDefault("sortBy", "id");
        String sortDir = params.getOrDefault("sortDir", "asc");

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return PageRequest.of(page, size, sort);
    }

    public static <T> Map<String, Object> createResponse(Page<T> page) {
        return Map.of(
                "content", page.getContent(),
                "currentPage", page.getNumber(),
                "totalItems", page.getTotalElements(),
                "totalPages", page.getTotalPages(),
                "isLast", page.isLast()
        );
    }
}
