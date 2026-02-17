package com.application.ecom.service.interf;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;

import com.application.ecom.dto.OrderRequest;
import com.application.ecom.dto.Response;
import com.application.ecom.enums.OrderStatus;

public interface OrderItemService {
    Response placeOrder(OrderRequest orderRequest);
    Response updateOrderItemStatus(Long orderItemId, String status);
    Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable);
}
