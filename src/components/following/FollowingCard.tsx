import { View, Text } from 'react-native'
import React from 'react'
import { IUser } from '../../models/user'
import Box from '../general/Box';
import CustomText from '../general/CustomText';
import PrimaryButton from '../general/PrimaryButton';
import CustomButton from '../general/CustomButton';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Image } from 'expo-image';
import httpService, { IMAGE_BASE } from '../../utils/httpService';
import { FollowingModel } from '../../models/followingModal';
import { useMutation, useQueryClient } from 'react-query';
import { URLS } from '../../services/urls';
import useToast from '../../hooks/useToast';

interface IProps {
    user: FollowingModel;
    isFollower?: boolean;
}

const FollowingCard = ({user, isFollower = false }:IProps) => {
    const theme = useTheme<Theme>();
    const toast = useToast();

    const queryClient = useQueryClient();

    const follow = useMutation({
        mutationFn: () => httpService.post(`${URLS.FOLLOW_OR_UNFOLLOW_USER}/${user.follower.id}`),
        onError: (error: any) => {
          toast.show(error.message, { type: 'error' });
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries([`getFollower-${user.user_id}`]);
        }
      });

  return (
    <Box width='100%' height={70} flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='s'>
        <Box flexDirection='row'>
            <Box width={40} height={40} borderRadius={20} bg='grey' overflow='hidden'>
                <Image source={{ uri: isFollower ? `${IMAGE_BASE}${user.follower.profile_image}`: `${IMAGE_BASE}${user.following.profile_image}`}} contentFit='cover' style={{ width: '100%', height: '100%' }} />
            </Box>
            <Box marginLeft='s' flexDirection='row' alignItems='center'>
                <CustomText variant='body'>{isFollower ? user.follower.name : user.following.name}</CustomText>
                <CustomText variant='xs'>@{isFollower ? user.follower.username.length > 15 ? user.follower.username.slice(0, 15) + '...': user.follower.username  : user.following.username.length > 15 ? user.following.username.slice(0, 15) + '...' : user.following.username}</CustomText>
            </Box>
        </Box>

        { isFollower && <PrimaryButton title='Follow' onPress={() => follow.mutate()} isLoading={follow.isLoading} height={35} /> }
        { !isFollower && <CustomButton color={theme.colors.grey} title='Following' onPress={() => {}} height={35} /> }
    </Box>
  )
}

export default FollowingCard