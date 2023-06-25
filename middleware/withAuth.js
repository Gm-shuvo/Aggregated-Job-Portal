import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { parseCookies } from 'nookies';

import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';

export function withAuth(Component) {
  return function WithAuth(props) {
    const router = useRouter();
    const user = useSelector((state) => state.User.userData);

    useEffect(() => {
      const { token } = parseCookies(); // Retrieve the JWT token from cookies
      console.log(token, user)
      // If the JWT token is not present or expired, redirect to the login page
      if (!user?._id ||!token || isTokenExpired(token)) {
        router.replace('/auth/login');
      }
    }, [user, router]);

    return user ? <Component {...props} /> : null;
  };
}

// Function to check if the JWT token is expired
function isTokenExpired(token) {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds

  return decodedToken.exp < currentTime;
}
