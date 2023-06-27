import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setUserData } from '@/Utils/UserSlice';
import jwtDecode from 'jwt-decode';

export function withAuth(Component) {
  return function WithAuth(props) {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.User?.userData);

    useEffect(() => {
      const { token } = parseCookies(); // Retrieve the JWT token from cookies

      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }

      // Set the user data from localStorage if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        dispatch(setUserData(JSON.parse(storedUser)));
      }
    }, [router, dispatch]);

    const handleLogout = async () => {
     
        Cookies.remove('token');
        localStorage.removeItem('user');
        dispatch(setUserData(null));
        router.push('/auth/login');

    };

    return user ? <Component {...props} /> : null;
  };
}

// Function to check if the JWT token is expired
function isTokenExpired(token) {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds

  return decodedToken.exp < currentTime;
}
