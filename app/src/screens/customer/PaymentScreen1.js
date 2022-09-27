import React, { Component } from "react";
import ApiCustomerService from "../../services/customer/ApiCustomerService";
import Navigation from "../../components/Navigation";
import { useState, setState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import logo from "../../components/RazorpayLogo.jpg";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";


function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function PaymentScreen1() {
 

  const [paymentdata, setPaymentdata] = useState({
    paymentType: " ",
    deliveryBoyId: " ",
    orderId: " ",
  });
  const history = useHistory();

  

  async function Razorpay() {
    await ApiCustomerService.addpaymentDetails(
      JSON.parse(window.localStorage.getItem("user_id"))
    ).then((res) => {
      window.localStorage.setItem("secretKey", res.data.secretKey);
      window.localStorage.setItem("razorpayOrderId", res.data.razorpayOrderId);
      window.localStorage.setItem("applicationFee", res.data.applicationFee);
      window.localStorage.setItem("secretId", res.data.secretId);

    });

   

    await ApiCustomerService.addorders(
      window.localStorage.getItem("total_price"),
      window.localStorage.getItem("user_id")
    ).then((res) => {
      JSON.stringify(window.localStorage.setItem("orderId", res.data.result));
    });

    await ApiCustomerService.addDetails(
      window.localStorage.getItem("user_id"),
      JSON.parse(window.localStorage.getItem("orderId"))
    ).then((res) => {
      JSON.stringify(
        window.localStorage.setItem("deliveryBoyId", res.data.result)
      );
    });
    //alert(JSON.parse(window.localStorage.getItem("deliveryBoyId")));
   

    await ApiCustomerService.addOrderIdtoOrderAddress(
      window.localStorage.getItem("address_id"),
      window.localStorage.getItem("orderId")
    );

    //alert(Amount);
    // alert(razorpayOrderId);
    // alert(secretKey);
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      swal("error","Razorpay SDK failed to load. Are you online?","error");

      //Because Payment is failed
      swal("error","payment failed","error");
      swal("error","We got an issue!!!! pay at delivery time","error");
      const Paymentdata = {
        paymentType: "COD",
        deliveryBoyId: JSON.parse(window.localStorage.getItem("deliveryBoyId")),
        orderId: JSON.parse(window.localStorage.getItem("orderId")),
      };
      await ApiCustomerService.addpaymentDetails1(Paymentdata);
      window.localStorage.setItem("cart_size",0);
      history.push("/home");

      return;
    }

    //console.log(data);

    const options = {
      key: window.localStorage.getItem("secretId"), //razorpayId,
      currency: "INR",
      amount: window.localStorage.getItem("applicationFee"), // window.localStorage.getItem("total_price" * 10000),
      order_id: window.localStorage.getItem("razorpayOrderId"), //window.localStorage.getItem("razorpayOrderId"), //"order_KKD9Q0Bp6nqpMH" ,
      name: "Green Mart",
      description: "Thank you for Shopping",
      image: { logo },
      handler: function (response) {
        const Paymentdata = {
          paymentType: "DEBIT",
          deliveryBoyId: JSON.parse(window.localStorage.getItem("deliveryBoyId")),
          orderId: JSON.parse(window.localStorage.getItem("orderId")),
        };
        ApiCustomerService.addpaymentDetails1(Paymentdata);
        swal("Payment Id ", response.razorpay_payment_id,"info");
        //alert("ordere_Id= " + response.razorpay_order_id);
        //alert("Payment Signature= " + response.razorpay_signature);

        swal("success","Transaction successful","success");

        window.localStorage.removeItem("cart_size");
      },
      prefill: {
        name: "Green Mart",
        email: "greenmart@gmail.com",
        phone_number: "9899999999",
      },
    };
    const paymentObject = new window.Razorpay(options);

    paymentObject.on('payment.failed', function (response){
      alert(response.error.code,);
      alert(response.error.description,);
      swal("error",response.error.source,"error");
      swal("error",response.error.step,"error");
      swal("error","payment failed","error");
      swal("error","We got an issue!!!! pay at delivery time","error");
      const Paymentdata = {
        paymentType: "COD",
        deliveryBoyId: JSON.parse(window.localStorage.getItem("deliveryBoyId")),
        orderId: JSON.parse(window.localStorage.getItem("orderId")),
      };
     ApiCustomerService.addpaymentDetails1(Paymentdata);
     window.localStorage.setItem("cart_size",0);
      history.push("/home");

});
    await paymentObject.open();
    //alert(razorpayOrderId);
    window.localStorage.removeItem("secretKey");
    window.localStorage.removeItem("razorpayOrderId");
    window.localStorage.removeItem("applicationFee");
    window.localStorage.removeItem("secretId");
    history.push("/home");
  }

  return (
    <div className="container">
      <header className="App-header">
        <img
          src={logo}
          width="150"
          height="150"
          class="rounded-circle"
          alt="Generic placeholder image"
        />
        <p>Click to get Payment Options</p>
        <a
          className="btn btn-primary btn-lg"
          onClick={Razorpay}
          target="_blank"
          rel="noopener noreferrer"
        >
          Pay Now
        </a>
      </header>
    </div>
  );
}

export default PaymentScreen1;