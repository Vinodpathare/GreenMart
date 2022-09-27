import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import swal from "sweetalert";
import { Button, Divider, Input } from 'antd';
import './ForgotPass.css';
import ApiCustomerService from "../../services/customer/ApiCustomerService";




const ForgotPassword = (props) => {
    const [destEmail, setEmail] = useState();
    const [otp, setOTP] = useState('');
    const [newPass, setNewPass] = useState('');
    const [otpFlag, setOtpFlag] = useState(false);
    const [waitOTP, setWaitOTP] = useState(false);
    const [sendOTPButton, setSendOTPButton] = useState(true);
    const [waitLockFlag, setWaitLockFlag] = useState(true);
    const [status, setStatus] = useState("");
    const [createdOtp, setCreatedOtp] = useState("");


    const sendOTPText = 'OTP sent successfully to your mail';
    const waitForOTPText = 'Sending OTP, wait for some time';

    const ResendOTP = () => {
        setSendOTPButton(true);
        setWaitOTP(true);
        setOtpFlag(false);
        sendOTP();


    }

    const validate = async () => {
        var body = {
            email: destEmail
        }
        await ApiCustomerService.checkUser(body)
            .then(response => setStatus(response.data))
            .catch(error => { swal("Could Not Verify Email") });
    }

    const sendOTP = () => {
        validate();
        if (status === "YES") {
            if (waitLockFlag) {
                console.log("-------------------------")
                setWaitLockFlag(false);
                setWaitOTP(true);
                console.log(destEmail);
                const data = { destEmail };
                axios.post(`http://localhost:8080/customers/send_otp`, data).
                    then(response => {
                        swal("Success", "OTP sent to your email", "success");
                        setOtpFlag(true); setWaitOTP(false);
                        setSendOTPButton(false);
                        setWaitLockFlag(true);
                        setWaitLockFlag(true);
                        setCreatedOtp(response.data);
                        console.log(response.data);
                    }).
                    catch(error => {
                        swal("Wrong email you entered");
                        setWaitLockFlag(true);
                    });
            }
        } else {
            swal("Error", "Your Email Is Not Registered yet", "error")
        }

    }
    const handleSubmit = () => {
        if (parseInt(createdOtp) === parseInt(otp)) {
            const data = { email: destEmail, password: newPass };
            console.log(data);
            axios.post('http://localhost:8080/customers/changepass', data).then(response => { if (response.status == 200) swal("Success", "Password updated", "success"); props.history.push(`/login`) }).catch(error => { swal("Error", "Wrong details you entered", "error"); props.history.push(`/forgotpassword`) });
        } else {
            swal("Error", "OTP Did Not Match", "error")
        }
    }

    return (
        <>

            <div className="container_pass" >
                <h2 className="heading_pass">{'Request password reset email'}</h2>
                <Divider />
                <div className="form_wrapper_pass">
                    <Input

                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Your account email"
                        size="large"
                        className="form_input"
                    />
                </div>
                <div className="form_buttons_pass">
                    {sendOTPButton && <Button
                        onClick={sendOTP}
                        type="primary"
                        className="form_button"
                        color={'#208AEC'}
                        size="large"
                    >
                        Request password reset
                    </Button>
                    }
                    {waitOTP && <p>{waitForOTPText}</p>}{otpFlag && <p>{sendOTPText}</p>}
                    <br />
                    {otpFlag && <div>

                        <label htmlFor="">Enter OTP :&emsp; </label><input type="number" name="otp" value={otp} id="" onChange={e => setOTP(e.target.value)} /><br /><br />
                        <label htmlFor="">Enter new password :&emsp; </label><input type="password" name="otp" value={newPass} id="" onChange={e => setNewPass(e.target.value)} />
                        <br /><br />
                        <button className="btn btn-info btn-md" onClick={handleSubmit}>Submit</button> <br /><br />
                        <button className="btn btn-warning " onClick={ResendOTP}>Resend OTP</button>

                    </div>} <br /><br />
                </div>
            </div>

        </>

    );
}

export default ForgotPassword;