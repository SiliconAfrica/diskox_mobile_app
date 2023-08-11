import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import ChatList from '../../../components/chats/ChatList';
import { useChatScreenState } from './state';
import UserModal from '../../../components/chats/UsersModal';

const Chats = () => {
  const { showModal, setAll } = useChatScreenState((state) => state)
  const [page, setPage] = React.useState(0);

  return (
    <Box backgroundColor='secondaryBackGroundColor' flex={1}>
      {/* USERS MODAL */}
      <UserModal open={showModal} onClose={() => setAll({ showModal: false }) } />

      {/* USERS LIST */}
      <ChatList />
    </Box>
  )
}

export default Chats