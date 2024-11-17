import React, { useState } from 'react';
import styles from './authenticationStyle.module.scss';
import logo from '../../assets/login/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Authentication = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const email = localStorage.getItem('email_to_validate'); // Retrieve the email from local storage
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5122/api/Auth/validate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Received token:', data.token);
                localStorage.setItem('token', data.token); // Store token in local storage
                login(); //Set the user as logged in in auth context
                alert(data.message); // Display success message
                navigate('/overview');
            } else {
                const errorData = await response.json();
                alert(errorData.message); // Display error message
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleResendOtp = async () => {
        const email = localStorage.getItem('email_to_validate');

        if (!email) {
            alert("No email found for validation.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5122/api/Auth/generate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(email), // Send email as plain string
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Handle the JSON response
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error resending OTP.");
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred. Please try again.');
        }
    };






    return (
        <div className={styles.authentication_container}>
            <div className={styles.authentication_card}>
                <div className={styles.authentication_left}>
                    <div className={styles.logo}>
                        <img src={logo} alt="Logo" />
                    </div>
                    <br />
                    <h1>Hold on! Let's first verify.</h1>
                    <p className={styles.muted}>Please enter the OTP code we sent to your email to proceed.</p>
                    <br />
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="pin"
                            placeholder="Enter pin"
                            value={otp}
                            onChange={handleOtpChange}
                            required
                        />
                        <button
                            type="button"
                            className={styles.send_again}
                            onClick={handleResendOtp}
                            disabled={loading}
                        >
                            Send again
                        </button>
                        <button
                            type="submit"
                            className={styles.continue}
                            disabled={loading}
                        >
                            Continue
                        </button>
                    </form>
                </div>
                <div className={styles.authentication_right}></div>
            </div>
        </div>
    );
};

export default Authentication;
