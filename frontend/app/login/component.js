'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Simple input validation
        if (!username.trim() || !password) {
            setErrorMessage('Please enter both username and password.');
            return;
        }

        setLoading(true);

        try {
            // Retrieve CSRF token (if your Django backend requires it for session-based auth)
            const csrfToken = getCookie('csrftoken');

            // Create a FormData object
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/login/`,
                {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken, // Include CSRF token
                    },
                    credentials: 'include', // Include cookies for session-based authentication
                    body: formData, // Use FormData as the request body
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                // Provide user-friendly error feedback
                setErrorMessage(errorData.error || 'Invalid username or password.');
                return;
            }

            const data = await response.json();
            console.log('Login success:', data);
            // Clear the password from state after submission
            setPassword('');
            window.location.href = '/';
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form
                className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
                {errorMessage && (
                    <div className="mb-4 text-red-600">{errorMessage}</div>
                )}
                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-black"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-black"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
