package com.app.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.pojos.Role;
import com.app.pojos.User;

//@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	@Query("select u from User u where u.email=:em and u.password=:pass")
	User authenticateUser(@Param("em")String em, @Param("pass")String pass);

	@Query("select u.id from User u where u.role=:rl")
	List<Integer> getAllDeliveryBoy(@Param("rl")Role rl);
	
	List<User> findByRole(Role role);
	
	@Query("select u from User u where u.email=:em")
	User findByEmail(@Param("em")String email);

	@Modifying
	@Query("update User u set u.password = ?2 where u.email = ?1")
	int updatePasswordByEmail(String email, String password);

	boolean existsByEmail(String email);
	
	
}
