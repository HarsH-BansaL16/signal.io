import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useUserContext } from '../context/userContext';
import { getLocalStorage } from '../utils/helpers';
import { SkeletonLoader, UserListItem, UserBadgeItem } from '.';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  useToast,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  VStack,
  Text,
  Box,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { useChatContext } from '../context/chatContext';

axios.defaults.headers.common['Authorization'] = `Bearer ${getLocalStorage(
  'token'
)}`;

function UpdateGroupChatModal({ fetchMessages }) {
  const { currentUser } = useUserContext();
  const { selectedChat, setSelectedChat, setFetchFlag } = useChatContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async (query) => {
    setSearchText(query);
    try {
      setLoading(true);
      const response = await axios.get(`/api/user?search=${query}`);
      const { data } = response.data;
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: 'Failed to load search result',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAdd = async (userToBeAdded) => {
    if (selectedChat.users.find((user) => user._id === userToBeAdded._id)) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    if (selectedChat.groupAdmin._id !== currentUser.id) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'Only admin can add/remove users',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      setLoading(true);
      const body = {
        chatId: selectedChat._id,
        userId: userToBeAdded._id,
      };
      setLoading(true);
      const response = await axios.post('/api/chat/groupadd', body);
      const { data } = response.data;
      setSelectedChat(data);
      setFetchFlag((prev) => {
        return !prev;
      });
      setLoading(false);
    } catch (error) {
      const { message } = error.response.data;
      setLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemove = async (userToBeRemoved) => {
    if (selectedChat.groupAdmin._id !== currentUser.id) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'Only admin can add/remove users',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      setLoading(true);
      const body = {
        chatId: selectedChat._id,
        userId: userToBeRemoved._id,
      };
      setLoading(true);
      const response = await axios.post('/api/chat/groupremove', body);
      const { data } = response.data;
      setSelectedChat(data);
      setFetchFlag((prev) => {
        return !prev;
      });
      fetchMessages();
      setLoading(false);
    } catch (error) {
      const { message } = error.response.data;
      setLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRename = async () => {
    if (selectedChat.groupAdmin._id !== currentUser.id) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'Only admin can rename group',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    if (!groupChatName) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'Please write a group name',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      const body = {
        chatId: selectedChat._id,
        chatName: groupChatName,
      };
      setRenameLoading(true);
      const response = await axios.post('/api/chat/grouprename', body);
      const { data } = response.data;
      setSelectedChat(data);
      setFetchFlag((prev) => {
        return !prev;
      });
      setRenameLoading(false);
      return toast({
        position: 'top',
        title: 'Success',
        description: `Group chat name update to ${data.chatName}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      const { message } = error.response.data;
      setRenameLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLeaveLoading(true);
      const body = {
        chatId: selectedChat._id,
        userId: currentUser.id,
      };
      setLeaveLoading(true);
      const response = await axios.post('/api/chat/groupremove', body);
      const { data } = response.data;
      setFetchFlag((prev) => {
        return !prev;
      });
      setLeaveLoading(false);
      toast({
        position: 'top',
        title: 'Success',
        description: `You left ${data.chatName}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedChat(null);
    } catch (error) {
      const { message } = error.response.data;
      setLeaveLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <IconButton
        icon={<BsThreeDots />}
        colorScheme='gray'
        variant='ghost'
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <FormControl>
                <FormLabel>Group name</FormLabel>
                <HStack>
                  <Input
                    placeholder='Group name'
                    variant='filled'
                    focusBorderColor='green.500'
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    isLoading={renameLoading}
                    colorScheme='whatsapp'
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>Group users</FormLabel>
                <Input
                  placeholder='Search users'
                  variant='filled'
                  focusBorderColor='green.500'
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <FormHelperText>Eg: Varun, Tarun</FormHelperText>
              </FormControl>
              <Flex w='100%' flexWrap='wrap' justifyContent='flex-start'>
                {selectedChat.users.map((user, index) => {
                  return (
                    <UserBadgeItem
                      key={index}
                      user={user}
                      handleClick={handleRemove}
                    />
                  );
                })}
              </Flex>
            </VStack>
            {loading ? (
              <SkeletonLoader length='3' height='50px' mt='4' />
            ) : searchText !== '' && searchResult.length < 1 ? (
              <Text mt='4' textAlign='center' color='red.500'>
                No user found!
              </Text>
            ) : (
              <Box mt='4'>
                {searchResult.map((user, index) => {
                  return (
                    <UserListItem
                      key={index}
                      user={user}
                      handleClick={() => handleAdd(user)}
                    />
                  );
                })}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={leaveLoading}
              colorScheme='red'
              onClick={handleSubmit}
            >
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
