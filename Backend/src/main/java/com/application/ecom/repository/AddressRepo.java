package com.application.ecom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.application.ecom.entity.Address;

public interface AddressRepo extends JpaRepository<Address, Long> {
}
