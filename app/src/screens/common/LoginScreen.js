import "../../App.css"
import React, { Component } from 'react'
import Header from "../../components/Header"
import {Link} from 'react-router-dom'
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ApiCustomerService from "../../services/customer/ApiCustomerService";
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import swal from "sweetalert";

class  LoginScreen extends Component {

  constructor(props) {
    super(props)
    this.state ={
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      role: '', 
      message: '',
      
  }
    this.authenticateUser = this.authenticateUser.bind(this);
    this.getCartSize = this.getCartSize.bind(this);
    this.updateUserCart = this.updateUserCart.bind(this);
    //this.doSubmit=this.doSubmit.bind(this);
        
}
//onChange=(value)=>(console.log('value:',value));
componentDidMount () {
  loadCaptchaEnginge(6); 
};

// doSubmit = () => {
//     //let's assume there is an HTML input text box with id 'user_captcha_input' to get user input   
//        let user_captcha_value = document.getElementById('user_captcha_input').value;
  
//        if (validateCaptcha(user_captcha_value)==true) {
//            alert('Captcha Matched');
//        }
  
//        else {
//            alert('Captcha Does Not Match');
//        }
//    };



  onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });
        
        // doSubmit = () => {
        //   let user_captcha = document.getElementById('user_captcha_input').value;
        
        //  if (validateCaptcha(user_captcha)===true) {
        //       alert('Captcha Matched');
        //       loadCaptchaEnginge(6); 
        //       document.getElementById('user_captcha_input').value = "";    
        //   }
        
        //   else {
        //       alert('Captcha Does Not Match');
        //       document.getElementById('user_captcha_input').value = "";  

        //   }
        // };

        getCartSize(){
          setTimeout(() => { 
            ApiCustomerService.getCartByUserId(JSON.parse(window.localStorage.getItem("user_id")))
          .then((res) => {
              JSON.stringify(window.localStorage.setItem("cart_size", res.data.result.length) );
          }); }, 1000);
          
        }

        updateUserCart(){
          let cartUserId = JSON.parse(window.localStorage.getItem("user_id"));
          let cartSize = JSON.parse(window.localStorage.getItem("cart_size"));
          if(cartSize > 0 ){
            ApiCustomerService.updateCartUserId(cartUserId);
          }
          this.getCartSize();
        }
      authenticateUser = (e) => { 
        let user_captcha = document.getElementById('user_captcha_input').value;
        
          if (validateCaptcha(user_captcha)===true) {
           
              //alert('Captcha Matched');
               loadCaptchaEnginge(6); 
              document.getElementById('user_captcha_input').value = "";    
         
        e.preventDefault();
      let loginRequest = {email: this.state.email, password: this.state.password};
        ApiCustomerService.fetchUserByLoginrequest(loginRequest)
      .then(res => {
        let user = res.data.result;
        user == null && this.setState({message : 'Invalid Login Credentials'});
        user !== null && this.setState({
        id:user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        message:'',
        cart:[],
        })
        
          user != null && swal("Welcome "+this.state.role,"You Logged in successfully " ,"success");
          user != null && this.setState({message : 'User Login successfully.'});
          user != null && window.localStorage.setItem("status", true);
          user != null && window.localStorage.setItem("user_fname", user.firstName);
          user != null && window.localStorage.setItem("user_lname", user.lastName);
          user != null && window.localStorage.setItem("user_email", user.email);
          user != null && window.localStorage.setItem("user_phone", user.phone);
          user != null && window.localStorage.setItem("user_role", user.role);

          user != null && JSON.stringify(window.localStorage.setItem("user_id", user.id));        
          user != null && user.role === 'CUSTOMER' && this.updateUserCart();
          user != null && user.role === 'SUPPLIER' && this.props.history.push('/supplierhome');
          user != null && user.role === 'DELIVERY_BOY' && this.props.history.push('/deliveryboyhome');
          user != null && user.role === 'ADMIN' && this.props.history.push('/adminhome');
          user != null && user.role === 'CUSTOMER' && this.props.history.push('/home');
      });
    }
        
    else {
        swal("error",'Captcha Does Not Match',"error");
        document.getElementById('user_captcha_input').value = ""; 
    }
    }
   
     
    render(){
      console.log('renderer')
      return (
        <div>
          
           <Navigation/>
           <div className="main">
         <Header title="Login" />
         <br/>
         <h5 className="nameColor1">{this.state.message}</h5>
         {/* <form action="#" method="Post"> */}
           <form className="mb-3">
             <label className="form-label">Email</label>
             <input 
               type="email"
               className="form-control"
               placeholder="name@gmail.com"
               name="email"
               value={this.state.email}
               onChange={this.onChange}
             />
           </form>
           <div className="mb-3">
             <label className="form-label">Password</label>
             <input
               type="password"
               className="form-control"
               placeholder="*****" 
               name="password"
               value={this.state.password}
               onChange={this.onChange}>                
               </input>
           </div>
       
         <label className="form-label">Enter Captcha</label>
           <div className="form-row">
           <div>
       <LoadCanvasTemplate />
         </div> 
               <div className="mb-3">
               <input placeholder="Enter Captcha Value" className="form-control" id="user_captcha_input" name="user_captcha_input" type="text"></input></div>
               </div>
           
           <div className="mb-3">
             <br />
             <div className="float-start"><br></br>
               New User? <Link to="/create-account">Create Account here</Link><br></br>
               <Link to={'/forgotpassword'}>ForgotPassword</Link>
             </div>
             <button className="btn-hover color-9 float-end" onClick={ this.authenticateUser}>
               Login
             </button>
             
             <br></br>
             <br></br>
           </div>

           {/* </form> */}
       </div>
       
        </div>
     );
    }   
}
export default LoginScreen