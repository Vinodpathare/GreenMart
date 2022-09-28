package com.app.service;

import java.util.List;

import com.app.dto.LoginRequest;
import com.app.dto.UserDTO;
import com.app.dto.UserDto1;
import com.app.pojos.Address;
import com.app.pojos.User;

public interface IUserServices {
	User authenticateUser(LoginRequest loginRequest);
	
	UserDto1 createAccount(UserDto1 user);
	
	User editProfile(int userId, UserDTO userDTO);
	
	String changePassword(int userId, String pwd);
	
	Address getAddress(int userId);
	
	String editAddress(int userId, Address address);
	
	List<User> getAllSupplier();
	
	List<User> getAllDeliveryBoy();
	
	int addSupplierAccount(String categoryName, UserDto1 user);
	
	Address getAddressDetails(int orderId);
	
	User getUserDetails(int cId);

	boolean updatePass(LoginRequest userDto);

	String checkUser(String email);
	
}
