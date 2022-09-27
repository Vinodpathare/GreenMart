package com.app.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.pojos.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
	@Query("select c from Cart c where c.userId=:uId")
	List<Cart> getCartByuserId(@Param("uId")int uId);
	
	@Query(value="select CEILING(SUM(final_price)) from cart  where user_id=:uId",nativeQuery=true)
	Double getCartTotalAmt(@Param("uId") int uId);
	
	@Query(value="select CEILING(SUM(price))from cart  where user_id=:uId",nativeQuery=true)
	Double getCartTotalSAmt(@Param("uId") int uId);
	
	String deleteByUserId(int userId);
	
	List<Cart> findByUserId(int userId);
	
	Cart findByProductNameAndGrams(String pName, int grams);
	}
