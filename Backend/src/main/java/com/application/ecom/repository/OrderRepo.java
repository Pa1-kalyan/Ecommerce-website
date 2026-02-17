package com.application.ecom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.application.ecom.entity.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {
}
