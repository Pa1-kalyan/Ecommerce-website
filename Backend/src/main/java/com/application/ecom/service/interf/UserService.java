package com.application.ecom.service.interf;

import com.application.ecom.dto.LoginRequest;
import com.application.ecom.dto.Response;
import com.application.ecom.dto.UserDto;
import com.application.ecom.entity.User;

public interface UserService {
    Response registerUser(UserDto registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getLoginUser();
    Response getUserInfoAndOrderHistory();
}
