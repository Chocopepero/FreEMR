'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const NavBar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/current_user/`,
                    {
                        credentials: 'include', // Ensure cookies (and session) are sent
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/logout/`, {
                method: 'POST',
                credentials: 'include', // Ensures cookies are sent
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
            });
            if (res.ok) {
                console.log('Logged out successfully');
                window.location.reload();

            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className='topbar flex justify-between items-center bg-blue-500'>
            <div className="text-xl text-left py-4 pl-4 w-1/3">
                FreMR
            </div>
            <div className='w-1/3' />
            <div className='w-1/3 flex justify-end items-center py-4 pr-4'>
                {user && user.username ? (
                    <div>
                        <span>Welcome, {user.username}</span> 
                        <br />
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link href="/login">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
}

export default NavBar;