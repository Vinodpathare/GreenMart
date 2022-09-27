package com.app.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderResponse {

String secretKey;
String razorpayOrderId;
double applicationFee;
String secretId;
String pgName;
}
