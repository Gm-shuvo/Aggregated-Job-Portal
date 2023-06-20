import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { parseCookies,  } from 'nookies';

import jwtDecode from 'jwt-decode';

export function withAuth(Component) {
  return function WithAuth(props) {
    const router = useRouter();

    useEffect(() => {
      const { token } = parseCookies(); // Retrieve the JWT token from cookies
      console.log(token)
      // If the JWT token is not present or expired, redirect to the login page
      if (!token || isTokenExpired(token)) {
        router.push('/auth/login');
      }
    }, []);

    return <Component {...props} />;
  };
}

// Function to check if the JWT token is expired
function isTokenExpired(token) {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds

  return decodedToken.exp < currentTime;
}
