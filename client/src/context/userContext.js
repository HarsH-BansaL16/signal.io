import React, { useContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const toast = useToast();
  const API_URL = process.env.REACT_APP_API_URL

  const setUser = (user) => {
    setCurrentUser(user);
  };

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('Token not found')
        setAuthLoading(false)
        return
      }
      const response = await axios.post(
        `${API_URL}/api/user/auth`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
      const { data } = response.data;
      setUser(data);
      setAuthLoading(false);
    } catch (error) {
      console.log(error.response);
      setAuthLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, {
        email,
        password,
      })
      const { data } = response.data
  
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

      setUser(data)
      return toast({
        position: 'top',
        title: 'Logged In',
        description: `Logged in as ${data.name}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.log(error)
      const { message } = error.response.data
      return toast({
        position: 'top',
        title: 'Error occurred',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/register`, {
        name,
        email,
        password,
      })
      const { data } = response.data

      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

      setUser(data.data)
      return toast({
        position: 'top',
        title: 'Registration successful',
        description: `Logged in as ${data.data.name}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      const { message } = error.response.data
      return toast({
        position: 'top',
        title: 'Error occurred',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const logout = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/user/logout`)
      const { message } = response.data

      localStorage.removeItem('token')

      setUser(null)
      return toast({
        position: 'top',
        title: 'Success',
        description: message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      const { message } = error.response.data
      return toast({
        position: 'top',
        title: 'Error occurred',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line
  }, []);

  return (
    <UserContext.Provider
      value={{ currentUser, authLoading, login, register, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
