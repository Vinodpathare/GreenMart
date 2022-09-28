package com.app.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.AddressRepository;
import com.app.dao.CategoryRepository;
import com.app.dao.OrdersRepository;
import com.app.dao.SupplierRepository;
import com.app.dao.UserRepository;
import com.app.dto.LoginRequest;
import com.app.dto.UserDTO;
import com.app.dto.UserDto1;
import com.app.pojos.Address;
import com.app.pojos.Category;
import com.app.pojos.Orders;
import com.app.pojos.Role;
import com.app.pojos.Supplier;
import com.app.pojos.User;


@Service
@Transactional
public class UserServiceImpl implements IUserServices {
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private AddressRepository addressrepo;
	
	@Autowired
	private CategoryRepository cateRepo;
	
	@Autowired
	private SupplierRepository supRepo;
	
	@Autowired
	private OrdersRepository orderRepo;
	@Autowired
	private PasswordEncoder passEncoder;
	@Autowired
	private ModelMapper mapper;
	
	@Override
	public User authenticateUser(LoginRequest loginRequest) {
		User u=userRepo.findByEmail(loginRequest.getEmail());
		String rawPass=loginRequest.getPassword();
		if(u!= null && passEncoder.matches(rawPass, u.getPassword())) 
		{
			UserDto1 result=mapper.map(u, UserDto1.class);
			result.setPassword("*******");
			User u1=mapper.map(result, User.class);
			return u1;
			
		}
		return null;
	}
	
	@Override
	public UserDto1 createAccount(UserDto1 userDto) {
		String rawPassword=userDto.getPassword();
		String encPassword=passEncoder.encode(rawPassword);
		userDto.setPassword(encPassword);

		User u = mapper.map(userDto, User.class);
		u=userRepo.save(u);
		userDto=mapper.map(u, UserDto1.class);
		userDto.setPassword("*******");
		Address add = new Address();
		add.setCity("Pune");
		add.setState("Maharashtra");
		add.setCurrentUser(u);
		addressrepo.save(add);
		return userDto;
	}
	
	@Override
	public User editProfile(int userId, UserDTO userDTO) {
		User user = userRepo.findById(userId).get();
		user.setFirstName(userDTO.getFirstName());
		user.setLastName(userDTO.getLastName());
		user.setPhone(userDTO.getPhone());
		return user;
	}
	
	@Override
	public String changePassword(int userId, String pwd) {
		User u = userRepo.findById(userId).get();
		String rawPassword=pwd;
		String encPassword=passEncoder.encode(rawPassword);
		u.setPassword(encPassword);
		return "Password Changed successfully";
	}
	
	@Override
	public Address getAddress(int userId) {
		return addressrepo.findById(userId).get();
	}
	
	@Override
	public String editAddress(int userId, Address address) {
		Address add = addressrepo.findById(userId).get();
		System.out.println("address : "+add);
		if(add != null) {
		add.setArea(address.getArea());
		add.setCity(address.getCity());
		add.setFlatNo(address.getFlatNo());
		add.setPinCode(address.getPinCode());
		add.setSocietyName(address.getSocietyName());
		add.setState(address.getState());
		}
		return "Address Changed successfully";
	}
	
	@Override
	public List<User> getAllSupplier() {
		
		return userRepo.findByRole(Role.SUPPLIER);
	}
	
	@Override
	public List<User> getAllDeliveryBoy() {
		return userRepo.findByRole(Role.DELIVERY_BOY);
	}
	
	@Override
	public int addSupplierAccount(String categoryName, UserDto1 user) {
		String rawPassword=user.getPassword();
		String encPassword=passEncoder.encode(rawPassword);
		user.setPassword(encPassword);

		User u = mapper.map(user, User.class);
		userRepo.save(u);
		user = mapper.map(u, UserDto1.class);
		user.setPassword("*******");
		//User u = userRepo.save(user);
		Address add = new Address();
		add.setCity("Pune");
		add.setState("Maharashtra");
		add.setCurrentUser(u);
		addressrepo.save(add);
		
		Category c = new Category();
		c.setCategoryName(categoryName);
		Category cat = cateRepo.save(c);
		
		Supplier supp = new Supplier();
		supp.setCurrentUser(u);
		supp.setSupplierCategory(cat);
		supRepo.save(supp);
		return supp.getCurrentUser().getId();
	}
	
	@Override
	public Address getAddressDetails(int orderId) {
		Orders od = orderRepo.findById(orderId).get();
		User u = od.getSelectedCustomer();		
		return addressrepo.findById(u.getId()).get();
	}
	
	@Override
	public User getUserDetails(int oId) {
		Orders o = orderRepo.findById(oId).get();
		System.out.println("User : "+o.getSelectedCustomer());
		return o.getSelectedCustomer();
	}
@Override
	public boolean updatePass(LoginRequest userDto) {
	User u = userRepo.findByEmail(userDto.getEmail());
	String rawPassword=userDto.getPassword();
	String encPassword=passEncoder.encode(rawPassword);
	if(userRepo.updatePasswordByEmail(userDto.getEmail(),encPassword)==1) {
		 System.out.println("updating pass");
	return true;
	 }
	return false;
	}
@Override
public String checkUser(String email) {
	String msg="NO";
		if(userRepo.existsByEmail(email)) {
			msg="YES";
		}		
		return msg;
}

}
