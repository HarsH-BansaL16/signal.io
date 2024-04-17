import React, { useEffect } from 'react'
import logo from '../assets/logo.png'
import { Login, PreLoader, Register } from '../components'
import { useUserContext } from '../context/userContext'
import {
  Box,
  Container,
  Flex,
  Image,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'

function Homepage() {
  const { authLoading } = useUserContext()

  useEffect(() => {
    document.title = 'Signal.io | Login/Register'
  }, [])

  if (authLoading) {
    return <PreLoader />
  }

  return (
    <Container maxWidth='xl' mb='8'>
      <Flex justifyContent='center'>
        <Image
          boxSize='300px'
          src={logo}
          borderRadius='1000px'
          padding='100px'
        />
      </Flex>
      <Box p='4' borderRadius='md' shadow='md'>
        <Tabs variant='soft-rounded' colorScheme='green' isFitted>
          <TabList mb='1'>
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
