import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { parseCookies } from 'nookies';

import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setUserData } from '@/Utils/UserSlice';

export function withAuth(Component) {
  return function WithAuth(props) {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.User?.userData);

    useEffect(() => {
      const { token } = parseCookies(); // Retrieve the JWT token from cookies
      // If the JWT token is not present or expired, redirect to the login page
      if (!token || isTokenExpired(token)) {
        Cookies.remove("token");
        localStorage.removeItem("user");
        dispatch(setUserData(null));

        router.push('/');
      }
    }, [user, router, dispatch]);

    return user ? <Component {...props} /> : null;
  };
}

// Function to check if the JWT token is expired
function isTokenExpired(token) {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds

  return decodedToken.exp < currentTime;
}
