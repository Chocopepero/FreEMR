'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
    return function AuthenticatedComponent(props) {
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            async function checkAuth() {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/current_user/`, {
                        credentials: 'include', // Include cookies for session-based authentication
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.username) {
                            setIsAuthenticated(true); // User is authenticated
                        } else {
                            router.push('/login'); // Redirect to login if not authenticated
                        }
                    } else {
                        router.push('/login'); // Redirect to login if not authenticated
                    }
                } catch (error) {
                    console.error('Error checking authentication:', error);
                    router.push('/login'); // Redirect to login on error
                } finally {
                    setLoading(false); // Stop loading
                }
            }

            checkAuth();
        }, [router]);

        if (loading) {
            return <div>Loading...</div>; // Show a loading indicator while checking authentication
        }

        if (!isAuthenticated) {
            return null; // Prevent rendering if not authenticated
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;