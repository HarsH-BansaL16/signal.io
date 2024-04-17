import React, { useState } from 'react';
import { useUserContext } from '../context/userContext';
import useMounted from '../hooks/useMounted';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  useToast,
} from '@chakra-ui/react';

const initialCredential = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function Register() {
  const { register } = useUserContext();

  const [credentials, setCredentials] = useState(initialCredential);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const toast = useToast();
  const mounted = useMounted();

  const handleShow = () => {
    setShow((prev) => {
      return !prev;
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCredentials((prev) => {
      return { ...prev, [name]: value };
    });
  };


  const handleSubmit = async () => {
    const { name, email, password, confirmPassword } = credentials;
    if (!name || !email || !password) {
      return toast({
        position: 'top',
        title: 'Invalid Input',
        description: 'Provide all the credentials',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    if (password !== confirmPassword) {
      return toast({
        position: 'top',
        title: 'Invalid Input',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(true);
    await register(name, email, password);
    if (mounted.current) {
      setLoading(false);
    }
  };

  return (
    <VStack spacing='4'>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          name='name'
          placeholder='Enter your name'
          variant='filled'
          focusBorderColor='green.500'
          value={credentials.name}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          name='email'
          placeholder='Enter your email'
          variant='filled'
          focusBorderColor='green.500'
          value={credentials.email}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            name='password'
            pr='4.5rem'
            variant='filled'
            focusBorderColor='green.500'
            type={show ? 'text' : 'password'}
            placeholder='Enter password'
            value={credentials.password}
            onChange={handleChange}
          />
          <InputRightElement width='4.5rem'>
            <Button
              h='1.75rem'
              size='sm'
              colorScheme='whatsapp'
              onClick={handleShow}
            >
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size='md'>
          <Input
            name='confirmPassword'
            pr='4.5rem'
            variant='filled'
            focusBorderColor='green.500'
            type={show ? 'text' : 'password'}
            placeholder='Enter password'
            value={credentials.confirmPassword}
            onChange={handleChange}
          />
          <InputRightElement width='4.5rem'>
            <Button
              h='1.75rem'
              size='sm'
              colorScheme='whatsapp'
              onClick={handleShow}
            >
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        isFullWidth
        isLoading={loading}
        colorScheme='whatsapp'
        onClick={handleSubmit}
      >
        Register
      </Button>
    </VStack>
  );
}

export default Register;
