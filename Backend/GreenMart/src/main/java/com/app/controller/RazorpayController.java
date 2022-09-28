package com.app.controller;



import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.OrderResponse;
import com.app.dto.PaymentDTO;
import com.app.dto.ResponseDTO;
import com.app.service.ICustomerServices;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "*")
public class RazorpayController {

	@Autowired
	private ICustomerServices custRepo;
	
	
	
	private RazorpayClient client;
	private static final String SECRET_ID1 = "rzp_test_g6DuJ0XYgkDJg7";
	private static final String SECRET_KEY1 = "p6Oo3ZdaVOlxb3Pl5nBCHrQe";
	//private static final String SECRET_ID2 = "rzp_test_J4fInjDpTX475d";
	//private static final String SECRET_KEY2 = "r8fNXAB78RmsVfdiQbWGwyjr";
	
	@GetMapping("/payment/{userId}")
	//public OrderResponse createOrder(@RequestBody OrderRequest orderRequest) {
	public OrderResponse createOrder(@PathVariable int userId) {	
	OrderResponse response = new OrderResponse();
		try {

			double Amount=custRepo.getCartTotalAmt(userId);
			double Pay=Amount!=0?Amount:1;
				client = new RazorpayClient(SECRET_ID1, SECRET_KEY1);
			

			//Order order = createRazorPayOrder(orderRequest.getAmount());
				Order order = createRazorPayOrder(Pay);
			System.out.println("---------------------------");
			String orderId = (String) order.get("id");
			System.out.println("Order ID: " + orderId);
			
			System.out.println("---------------------------");
			response.setRazorpayOrderId(orderId);
			//response.setApplicationFee("" + orderRequest.getAmount());
			response.setApplicationFee(Pay);
			
			
				response.setSecretKey(SECRET_KEY1);
				response.setSecretId(SECRET_ID1);
				response.setPgName("razor1");
			
			return response;
		} catch (RazorpayException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return response;

	}

	private Order createRazorPayOrder(Double double1) throws RazorpayException {

		JSONObject options = new JSONObject();
		options.put("amount", double1*100);
		options.put("currency", "INR");
		options.put("receipt", "txn_123456");
		options.put("payment_capture", 1); // You can enable this if you want to do Auto Capture.
		return client.orders.create(options);
	}

@PostMapping("/paymentadd")
public ResponseDTO<?> addpayment(@RequestBody PaymentDTO paymentDTO){
	System.out.println("in addpayment: "+paymentDTO);
	try {				
		return new ResponseDTO<>(HttpStatus.OK, "Payment Done", custRepo.addPayment(paymentDTO));
	}catch (RuntimeException e) {
		System.out.println("err in addpayment : "+e);
		return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR, "Payment Not Done", null);
	}
}
}