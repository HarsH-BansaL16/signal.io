import React from 'react'
import { MdNoEncryptionGmailerrorred } from 'react-icons/md'
import { Progress, VStack, Text, HStack, Icon } from '@chakra-ui/react'

function PreLoader() {
  return (
    <VStack
      w='100%'
      h='100vh'
      spacing='4'
      justifyContent='center'
      alignItems='center'
    >
      <Progress size='xs' w='40%' colorScheme='whatsapp' isIndeterminate />
      <HStack>
        <Icon as={MdNoEncryptionGmailerrorred} color='gray.400' />
        <Text fontWeight='300' color='gray.400'>
          Not End-To-End encrypted
        </Text>
      </HStack>
    </VStack>
  )
}

export default PreLoader
