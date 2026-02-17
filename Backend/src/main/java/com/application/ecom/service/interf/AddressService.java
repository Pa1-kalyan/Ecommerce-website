package com.application.ecom.service.interf;

import com.application.ecom.dto.AddressDto;
import com.application.ecom.dto.Response;

public interface AddressService {
    Response saveAndUpdateAddress(AddressDto addressDto);
}
