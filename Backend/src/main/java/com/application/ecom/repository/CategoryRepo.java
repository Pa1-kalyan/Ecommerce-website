package com.application.ecom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.application.ecom.entity.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {
}
