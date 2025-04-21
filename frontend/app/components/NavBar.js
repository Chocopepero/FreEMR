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
                    `$/api/current_user/`,
                    {
                        credentials: 'include',
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
        console.log("document.cookie:", document.cookie);
        console.log("csrfToken:", csrfToken);
        try {
            const res = await fetch(`/api/logout/`, {
                method: 'POST',
                credentials: 'include', // Ensures cookies are sent
                headers: {
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
        <div className='topbar flex justify-between items-center bg-gradient-to-r from-nav-left via-nav-center to-nav-right sticky top-0 z-50 rounded'>
            <Link 
            className="text-xl text-left py-4 px-4 w-auto"
            href={"/"}
            >
                FreEMR
            </Link>
            <div className='w-2/3 flex justify-end py-4 pr-4'>
                {user && user.username ? (
                    <div className='flex items-center space-x-4'>
                        <Link className='flex bg-gray-700 px-2 py-1 rounded-xl' href={"/"}>Home</Link>
                        <Link className='flex bg-gray-700 px-2 py-1 rounded-xl' href={"/scenario"}>Scenarios</Link>
                        <Link className='flex bg-gray-700 px-2 py-1 rounded-xl' href={"/patients"}>Patients</Link>
                        <Link className='flex bg-purple-500 px-2 py-1 rounded-xl' href={"https://forms.gle/Po3wYK7yyeHcMQvMA"}>Feedback</Link>
                        <div className="flex flex-col">
                            <span>Welcome, {user.username}</span>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
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