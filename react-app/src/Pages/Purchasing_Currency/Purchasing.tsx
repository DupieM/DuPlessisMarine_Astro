import React, { useEffect, useState } from 'react';
import styles from './Purchasing.module.scss';
import Navbar from '../../Components/Navbar/Navbar';
import SwitchIcon from "../../assets/icons/SwitchIcon.svg";
import SwitchIcon_black from "../../assets/icons/SwitchIcon_black.svg";
import CheckIcon from "../../assets/icons/CheckIcon.svg";



function Purchasing() {
    const [activeTab, setActiveTab] = useState<'buy' | 'withdraw'>('buy');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [astroPrice, setAstroPrice] = useState(0);
    const [astroTokens, setAstroTokens] = useState(0);
    const [transactionFee, setTransactionFee] = useState(0);
    const [tokensToPurchase, setTokensToPurchase] = useState(0);
    const [tokensToWithdraw, setTokensToWithdraw] = useState(0);
    const [availableUsers, setAvailableUsers] = useState<{ username: string, email: string }[]>([]);
    const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
    const [tokensToPay, setTokensToPay] = useState<number>(0);

    const email = localStorage.getItem("email_to_validate");

    useEffect(() => {
        // Fetch AST price and tokens
        const fetchAstroPrice = async () => {
            try {
                const response = await fetch(`http://localhost:5122/api/Purchasing/astro-price?email=${email}`);
                const data = await response.json();
                setAstroPrice(data.price);
                setAstroTokens(data.tokens);
            } catch (error) {
                console.error("Error fetching Astro price:", error);
            }
        };

        // Fetch transaction fee
        const fetchTransactionFee = async () => {
            try {
                const response = await fetch(`http://localhost:5122/api/Purchasing/transaction-fee?email=${email}`);
                const data = await response.json();
                setTransactionFee(data.fee);
            } catch (error) {
                console.error("Error fetching transaction fee:", error);
            }
        };

        fetchAstroPrice();
        fetchTransactionFee();
    }, [email]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    const handleConfirmTransaction = async () => {
        // Log the email to verify its value
        console.log("Email to validate:", email);

        if (!email) {
            console.error("Email is not available in localStorage.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5122/api/Purchasing/confirm-transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    tokensPurchased: tokensToPurchase
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAstroTokens(data.updatedTokens);
                alert("Transaction confirmed!");
                closeModal();
            } else {
                console.error("Transaction failed:", await response.text());
            }
        } catch (error) {
            console.error("Error confirming transaction:", error);
        }
    };

    const handleWithdraw = async () => {
        if (!email) {
            console.error("Email is not available in localStorage.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5122/api/Purchasing/withdraw-astro-tokens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    tokensToWithdraw: tokensToWithdraw
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAstroTokens(data.updatedTokens);
                alert("Withdrawal successful!");
                closeModal();
            } else {
                console.error("Withdrawal failed:", await response.text());
            }
        } catch (error) {
            console.error("Error processing withdrawal:", error);
        }
    };

    useEffect(() => {
        const fetchAvailableUsers = async () => {
            try {
                const response = await fetch(`http://localhost:5122/api/Purchasing/available-users?email=${email}`);
                const data = await response.json();
                console.log("Fetched users:", data); // Log the raw data
                const users = data.$values || []; // Extract the $values property if it exists
                setAvailableUsers(users);
                console.log("Available users state:", users); // Log after state update
            } catch (error) {
                console.error("Error fetching available users:", error);
            }
        };

        fetchAvailableUsers();
    }, [email]);

    const handleMakePayment = async () => {
        if (!email || !selectedUserEmail) {
            console.error("Email or recipient email is not available.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5122/api/Purchasing/make-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderEmail: email,
                    recipientEmail: selectedUserEmail,
                    tokens: tokensToPay
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAstroTokens(data.updatedTokens);
                alert("Payment successful!");
                closeModal();
            } else {
                console.error("Payment failed:", await response.text());
            }
        } catch (error) {
            console.error("Error making payment:", error);
        }
    };

    return (
        <>

            {/* <Navbar></Navbar> */}

            <div className={styles.header}>
                <div className={styles.coinIcon}></div>
                <h1 className={styles.coinName}>Astro Coin</h1>
            </div>

            <div className={styles.testAlignment}>


                <div className={styles.purchasingContainer}>


                    <div className={styles.containerParent}>

                        <div className={styles.container}>
                            <div className={styles.tabs}>
                                <button
                                    className={`${styles.tab} ${activeTab === 'buy' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('buy')}
                                >
                                    Buy
                                </button>
                                <button
                                    className={`${styles.tab} ${activeTab === 'withdraw' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('withdraw')}
                                >
                                    Withdraw
                                </button>
                            </div>


                            {activeTab === 'buy' ? (
                                <>
                                    <div className={styles.card}>
                                        <div className={styles.balance}>
                                            Available balance
                                            <span className={styles.balanceAmount}>{astroTokens} AST</span>
                                            <div className={styles.dropdownWrapper}>
                                                <span className={styles.circle}></span>
                                                <select className={styles.dropdown}>
                                                    <option>AST</option>
                                                </select>
                                            </div>
                                        </div>
                                        <hr className={styles.hrAfterBalance} />
                                        <div className={styles.row}>
                                            <span>I want to buy</span>
                                            <input
                                                type="number"
                                                className={styles.input}
                                                placeholder="0.00"
                                                onChange={(e) => setTokensToPurchase(parseFloat(e.target.value))}
                                            />
                                            <div className={styles.dropdownWrapper}>
                                                <span className={styles.circle}></span>
                                                <select className={styles.dropdown}>
                                                    <option>AST</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={styles.continueButton} onClick={openModal}>Continue</button>
                                </>
                            ) : (
                                <>
                                    <div className={styles.card}>
                                        <div className={styles.balance}>
                                            Available balance
                                            <span className={styles.balanceAmount}>{astroTokens} AST</span>
                                            <div className={styles.dropdownWrapper}>
                                                <span className={styles.circle}></span>
                                                <select className={styles.dropdown}>
                                                    <option>AST</option>
                                                </select>
                                            </div>
                                        </div>
                                        <hr className={styles.hrAfterBalance} />
                                        <div className={styles.row}>
                                            <span>I want to withdraw</span>
                                            <input
                                                type="number"
                                                className={styles.input}
                                                placeholder="0.00"
                                                onChange={(e) => setTokensToWithdraw(parseFloat(e.target.value))}
                                            />
                                            <div className={styles.dropdownWrapper}>
                                                <span className={styles.circle}></span>
                                                <select className={styles.dropdown}>
                                                    <option>AST</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={styles.continueButton} onClick={handleWithdraw}>Continue</button>

                                </>
                            )}

                            {/* <button className={styles.continueButton} onClick={openModal}>Continue</button> */}

                        </div>

                        <div className={styles.container2}>
                            <div className={styles.tabs}>
                                <button
                                    className={styles.tab2}
                                >
                                    Pay
                                </button>
                            </div>
                            <>
                                <div className={styles.card}>
                                    <div className={styles.balance}>
                                        Available balance
                                        <span className={styles.balanceAmount}>{astroTokens} AST</span>
                                        <div className={styles.dropdownWrapper}>
                                            <span className={styles.circle}></span>
                                            <select className={styles.dropdown}>
                                                <option>AST</option>
                                            </select>
                                        </div>
                                    </div>
                                    <hr className={styles.hrAfterBalance} />
                                    <div className={styles.row}>
                                        <span>I want to pay</span>
                                        <input
                                            type="number"
                                            className={styles.input}
                                            placeholder="0.00"
                                            onChange={(e) => setTokensToPay(parseFloat(e.target.value))}
                                        />
                                        <div className={styles.dropdownWrapper}>
                                            <span className={styles.circle}></span>
                                            <select className={styles.dropdown}>
                                                <option>AST</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={styles.row3}>
                                        <span>to the following user</span>

                                        <div className={styles.dropdownWrapper2}>
                                            <select
                                                className={styles.dropdown}
                                                value={selectedUserEmail}
                                                onChange={(e) => setSelectedUserEmail(e.target.value)}
                                            >
                                                <option value="">Select a user</option>
                                                {availableUsers.map(user => (
                                                    <option key={user.email} value={user.email}>{user.username}</option>
                                                ))}
                                            </select>
                                        </div>

                                    </div>
                                </div>
                                <button className={styles.continueButton} onClick={handleMakePayment}>Pay</button>
                            </>
                        </div>

                    </div>

                    <div className={styles.performance}>
                        <div className={styles.performance_row}>
                            <div className={styles.performance_row_1}>
                                <h2>Performance</h2>
                                <div className={styles.muted}>Updated on August 20 2024 12:00</div>
                            </div>
                            <div className={styles.performanceChange}>Coin <span>+2.42%</span></div>
                        </div>
                    </div>

                    <div className={styles.aboutCoin}>
                        <h2>About Coin</h2>
                        <p className={styles.muted}>Astro aims to empower users by offering innovative, secure, and user-friendly e-banking solutions that redefine the limits of financial management. We are committed to leveraging cutting-edge technology and industry practices to create a digital banking environment that prioritizes customer security, efficiency, and financial growth.</p>
                    </div>
                </div>

            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <span>Confirm Transaction</span>
                            <button className={styles.closeButton} onClick={closeModal}>
                                &times;
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <div className={styles.transactionDetails}>
                                <p className={styles.p1}>You will receive</p>
                                <h3>{tokensToPurchase} AST</h3>
                                <hr className={styles.hr} />
                                <div className={styles.transactionBreakdown}>
                                    <div className={styles.transactionBreakdownLeft}>
                                        <p>1 AST token costs</p>
                                        <p>You Pay</p>
                                        <p>Transaction Fee</p>
                                    </div>
                                    <div className={styles.transactionBreakdownRight}>
                                        <p>R {astroPrice}</p>
                                        <p>R {(tokensToPurchase * astroPrice).toFixed(2)}</p>
                                        <p>{transactionFee} Tokens</p>
                                    </div>
                                </div>
                            </div>
                            <button className={styles.confirmButton} onClick={handleConfirmTransaction}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default Purchasing;