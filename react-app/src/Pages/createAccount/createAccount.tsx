import React, { useState } from 'react';
import styles from './createAccountStyle.module.scss';
import logo from '../../assets/login/logo.png';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const navigate = useNavigate();

    // Handle input changes
    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(e.target.checked);
    };

    const handleCreationClick = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        if (!termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }

        // Prepare data
        const userData = {
            username: fullName,
            email: email,
            password: password,
        };

        try {
            // Send data to backend
            const response = await fetch('http://localhost:5122/api/Auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (response.ok) {
                    alert("Registration successful!");
                    // Store the email in local storage for validation
                    localStorage.setItem('email_to_validate', userData.email);
                    navigate('/authentication');
                } else {
                    alert(`Error: ${data.message}`);
                }
            } else {
                const textResponse = await response.text();
                console.error("Non-JSON response:", textResponse);
                alert("An unexpected error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_card}>
                <div className={styles.signup_left}>
                    <div className={styles.signup_logo}>
                        <img src={logo} alt="Logo" />
                    </div>
                    <br />
                    <h1>Create an Account!</h1>
                    <p className={styles.muted}>Provide your details so we can continue to your crypto adventure!</p>
                    <br />
                    <form>

                        <label className={styles.muted}>Your Full Name*</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={fullName}
                            onChange={handleFullNameChange}
                        />
                        <label className={styles.muted}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <label className={styles.muted}>Create password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange}
                        />


                        {/* <div className={styles.checkbox_container}>
                            <input type="checkbox" id="terms" />
                            <label htmlFor="terms" className={styles.muted}>I agree to terms and conditions.</label>
                        </div> */}

                        <div className={styles.checkbox_container}>
                            <input
                                type="checkbox"
                                id="terms"
                                className={styles.checkbox}
                                checked={termsAccepted}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="terms" className={styles.label}>
                                I agree to terms and conditions.
                            </label>
                        </div>

                        <button type="submit" onClick={handleCreationClick}>Continue</button>
                    </form>
                    <br />
                    <p className={styles.signup_link}><span className={styles.muted}> Already have an account? </span><a href="/login">Login</a></p>
                </div>
                <div className={styles.signup_right}></div>
            </div>
        </div>
    );
}

export default Signup;