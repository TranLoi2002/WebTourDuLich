package iuh.fit.se.blogservice.service;

import iuh.fit.se.blogservice.dto.CategoryDTO;
import iuh.fit.se.blogservice.model.Category;

import java.util.List;
import java.util.Map;

public interface CategoryService {
    Map<String, Object> getAllCategories(Map<String , String> params);
    CategoryDTO getCategoryById(Long id);
    CategoryDTO createCategory(CategoryDTO dto);
    CategoryDTO updateCategory(Long id, CategoryDTO dto);
    void deleteCategory(Long id);
}
