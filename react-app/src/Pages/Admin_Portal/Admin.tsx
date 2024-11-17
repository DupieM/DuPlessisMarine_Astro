import React, { useEffect, useState } from 'react';
import styles from './Admin.module.scss'
import img from '../Assets/Filter_Option.png';
import img2 from '../Assets/Search_Option.png';
import img3 from '../Assets/Purple_Circle.png';
import img4 from '../Assets/More_Option.png';
import { useNavigate } from 'react-router-dom';

// To define the shape of a User object
interface User {
    user_id: number;
    username: string;
    otp: string;
    created_at: string;
    email: string;
    role: string;
}

interface Status {
    account_id: number;
    active: boolean;
    balance: number;
    user_id: number;
}

function Admin() {

    //navigation to transactions page
    const navigate = useNavigate();

    // Initialize state to store fetched data from the users and accounts table
    const [users, setUsers] = useState<User[]>([]); 
    const [status, setStatus] = useState<Status[]>([]);

    // Initiaize state for the popup box at details
    const [popupVisible, setPopupVisible] = useState<{ [key: number]: boolean }>({});
    const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: 'active' | 'inactive' | null }>({});

    // Calling both url's from backend to display users and status of their account
    var url = "http://localhost:5122/api/User";
    var url2 = "http://localhost:5122/api/Account";  
    
    // Function to fetch user data
    const fetchUsers = () => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setUsers(data.$values);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    // Function to fetch account status data
    const fetchStatus = () => {
        fetch(url2)
        .then(response => response.json())
        .then(data => {
            setStatus(data.$values);
        })
        .catch(error => {
            console.error('Error fetching status data:', error);
        });
    };

    // Fetch data on initial render
    useEffect(() => {
        fetchUsers();
        fetchStatus();
    }, []);

    // Function to refresh user data when refresh button is clicked
    const handleRefreshClick = () => {
        console.log("Refresh button clicked");
        fetchUsers();
        fetchStatus();
    };
    
    // Click function to activate the popup state
    const handleDetailsClick = (userId: number) => {
        setPopupVisible(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
    };

    //Click function to be able to click between different option on the popup box
    const handleOptionClick = (userId: number, accountId: number, option: 'active' | 'inactive') => {
        const isFreezing = option === 'inactive';

        //To change the sate of the user status for when a account is frozen from active to inactive
        fetch(`http://localhost:5122/api/Account/accountId?accountId=${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: !isFreezing }) // Toggle account status
        })
        .then(response => response.json())
        .then(data => {
            console.log("Account status updated:", data);
            setStatus(prevStatus =>
                prevStatus.map(s =>
                    s.account_id === accountId ? { ...s, active: !isFreezing } : s
                )
            )
        })
        .catch(error => console.error('Error updating account status:', error));

        setPopupVisible(prevState => ({
            ...prevState,
            [userId]: false
        }));
    };

    //Click function to delete a user
    const handleDeleteClick = (userId: number) => {
        fetch(`http://localhost:5122/api/User/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                console.log(`User with ID ${userId} deleted successfully`);
                // Remove the user from the state to update the UI
                setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
            } else {
                console.error('Failed to delete the user');
            }
        })
        .catch(error => console.error('Error deleting user:', error));

        setPopupVisible(prevState => ({
            ...prevState,
            [userId]: false
        }));
    };


    console.log("Users" + users); //Test

    return (
        <div className={styles.adminMainContainer}>
            <div className={styles.admin_container}>
                <div>
                    <h1 className={styles.main_head}>Admin</h1>
                    <h2 className={styles.sub_head}>User</h2>

                    <div className={styles.admin_container_two}>
                        <h4 className={styles.body}>
                            <img src={img} alt="Logo" className={styles.image} />
                            Filter
                        </h4>
                        <div className={styles.searchFieldCon}>
                            <img src={img2} alt="search Icon" />
                            <input
                                className={styles.filterSearchInput}
                                type="text"
                                placeholder="Search"
                            />
                        </div>
                        <div className={styles.research}>
                            <div className={styles.filterOption}>
                                <button className={styles.thrityDaysFilterBtn} onClick={handleRefreshClick}>
                                    <p className={styles.filterOptionText} >Refresh</p>
                                </button>
                            </div>
                        </div>
                        
                    </div>

                    

                    <div className={styles.admin_card}>
                        <div className={styles.admin_container_three}>
                            <p className={styles.paragraph}>Name</p>
                            <p className={styles.paragraph_one_two}>Email</p>
                            <p className={styles.paragraph_two}>Join Date</p>
                            <p className={styles.paragraph_three}>User ID</p>
                            <p className={styles.paragraph_four_two}>Balance</p>
                            <p className={styles.paragraph_four}>Status</p>
                            <p className={styles.paragraph_five}>Action</p>
                        </div>

                        {/* map all the users that created an account */}
                        {users && users.length > 0 ? (
                            users
                            .filter(user => user.role === 'user') // Filter users by role
                            .sort((a, b) => a.user_id - b.user_id)
                            .map(user => {
                                const userStatus = status.find(s => s.user_id === user.user_id);

                                return (
                                    <div className={styles.admin_card_two} key={user.user_id}>
                                        <img src={img3} alt="Logo" className={styles.image2} />
                                        <div className={styles.name_box}>
                                            <p className={styles.paragraph_six}>{user.username}</p>
                                            <p className={styles.paragraph_seven}>{user.otp}</p>
                                        </div>
                                        <p className={styles.paragraph_seven_two}>{user.email}</p>
                                        <div className={styles.join_date_box}>
                                            <p className={styles.paragraph_six}>{new Date(user.created_at).toLocaleDateString()}</p>
                                            <p className={styles.paragraph_seven}>{new Date(user.created_at).toLocaleTimeString()}</p>
                                        </div>
                                        <p className={styles.paragraph_eight}>{user.user_id}</p>
                                        <div className={styles.box}></div>
                                        {/* Map balance of each user */}
                                        {userStatus ? (
                                                <p className={styles.paragraph_eight_two}>R {(Math.ceil(userStatus.balance * 100) / 100).toFixed(2)}</p>
                                        ) : (
                                            <p className={styles.paragraph_nine}>Loading...</p>
                                        )}
                                        <div className={styles.box_two}></div>
                                        {/* Map the status to say active(true) and inactive(false) */}
                                        {userStatus ? (
                                                <p 
                                                    className={styles.paragraph_nine}
                                                    style={{ color: userStatus.active ? '#0B9457' : '#FC684E' }}
                                                >
                                                    {userStatus.active ? 'Active' : 'Inactive'}
                                                </p>
                                        ) : (
                                            <p className={styles.paragraph_nine}>Loading...</p>
                                        )}
                                        <div>
                                            <p className={styles.body_three} onClick={() => handleDetailsClick(user.user_id)}>
                                                Details
                                                <img src={img4} alt="Logo" className={styles.image3} />
                                            </p>

                                            {/* Pop up box to display different options */}
                                            {popupVisible[user.user_id] && (
                                                <div className={styles.popup}>
                                                    <p onClick={() => userStatus && navigate(`/transactions/${userStatus.user_id}`)}>Transactions</p>
                                                    <p 
                                                        onClick={() => {
                                                            if (userStatus?.account_id !== undefined) {
                                                            handleOptionClick(user.user_id, userStatus.account_id, userStatus.active ? 'inactive' : 'active');
                                                            } else {
                                                            console.error('Error: account_id is undefined');
                                                            }
                                                        }}
                                                        >
                                                        {userStatus?.active ? 'Freeze acct.' : 'Unfreeze acct.'}
                                                    </p>
                                                    {/* <p>Delete acct.</p> */}
                                                    <p onClick={() => handleDeleteClick(user.user_id)}>Delete acct.</p>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className={styles.paragraph}>Loading...</p>
                        )}
                    </div>
                    <div>
                        <p className={styles.spacing}>Hallo</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;