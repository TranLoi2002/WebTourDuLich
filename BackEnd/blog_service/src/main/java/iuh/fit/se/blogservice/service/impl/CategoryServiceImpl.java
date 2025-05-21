package iuh.fit.se.blogservice.service.impl;

import iuh.fit.se.blogservice.dto.*;
import iuh.fit.se.blogservice.model.Blog;
import iuh.fit.se.blogservice.model.Category;
import iuh.fit.se.blogservice.repository.CategoryRepository;
import iuh.fit.se.blogservice.service.CategoryService;
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
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Map<String, Object> getAllCategories(Map<String, String> params) {
        Pageable pageable = PaginationUtil.createPageable(params);
        Page<Category> page = categoryRepository.findAll(pageable);

        // Ánh xạ từ Blog sang BlogDTO
        Page<CategoryDTO> dtoPage = page.map(this::mapToDTO);

        return PaginationUtil.createResponse(dtoPage);
    }

    @Override
    public CategoryDTO getCategoryById(Long id) {
        // Fetch the category from the repository
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Map the entity to DTO and return
        return mapToDTO(category);
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setActive(true);
        Category savedCategory = categoryRepository.save(category);
        return mapToDTO(savedCategory);
    }

    @Override
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        category.setUpdatedAt(LocalDateTime.now());
        category.setActive(dto.isActive());
        Category updatedCategory = categoryRepository.save(category);

        return mapToDTO(updatedCategory);
    }

    public CategoryDTO mapToDTO(Category cate) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(cate.getId());
        dto.setName(cate.getName());
        dto.setDescription(cate.getDescription());
        dto.setActive(cate.isActive());
        return dto;
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        if (category != null) {
            if(category.isActive()){
                category.setActive(false);
            } else {
                category.setActive(true);
            }
            categoryRepository.save(category);
        }
    }
}
