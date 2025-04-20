package iuh.fit.se.blogservice.service.impl;

import iuh.fit.se.blogservice.model.Category;
import iuh.fit.se.blogservice.repository.CategoryRepository;
import iuh.fit.se.blogservice.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        return categoryRepository.findById(id)
                .map(existingCategory -> {
                    existingCategory.setName(category.getName());
                    existingCategory.setDescription(category.getDescription());
                    return categoryRepository.save(existingCategory);
                })
                .orElse(null);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        if (category != null) {
            category.setActive(false);
            categoryRepository.save(category);
        }
    }
}
