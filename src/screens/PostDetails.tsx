import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useQueries, useMutation} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {Feather} from '@expo/vector-icons';
import {useToast} from 'react-native-toast-notifications';

import {Block, Text, Image, Button} from '../components';
import {useTheme, useTranslation} from '../hooks';
import {useChatStore, usePostStore} from '../store';
import {getPostById, getUserProfile} from '../services';
import {PostState} from '../store/usePostStore';
import {IPost} from '../components/Forms/RequestForm';
import deletePost from '../services/deletePost';

const isAndroid = Platform.OS === 'android';

const PostDetails = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const {t} = useTranslation();
  const {sizes, assets, colors, gradients} = useTheme();
  const [postId] = usePostStore((state: PostState) => [state.id]);
  const {setProductTitle, setRecipientId, setSenderId} = useChatStore();
  const [postQuery, userQuery] = useQueries({
    queries: [
      {
        queryKey: ['posts', postId],
        queryFn: () => getPostById(postId),
      },
      {
        queryKey: ['user'],
        queryFn: getUserProfile,
      },
    ],
  });
  const [postDetails, setPostDetails] = useState<IPost>({
    authorEmail: '',
    category: '',
    productCompany: '',
    productDescription: '',
    productName: '',
    productQuantity: 0,
    productImage: '',
    tags: [],
  });
  const [authorDetails, setAuthorDetails] = useState<any>({});
  const [isAuthorCurrentUser, setIsAuthorCurrentUser] = useState(false);
  const deletePostMutation = useMutation({
    mutationKey: ['posts'],
    mutationFn: deletePost,
  });

  useEffect(() => {
    if (postQuery.isSuccess) {
      setPostDetails(postQuery.data.data.data.postDetails);
      setAuthorDetails(postQuery.data.data.data.authorDetails);

      if (userQuery.isSuccess) {
        if (
          postQuery.data.data.data.authorDetails._id ===
          userQuery.data?.data?._id
        ) {
          setIsAuthorCurrentUser(true);
        } else {
          setIsAuthorCurrentUser(false);
        }
      }
    }
  }, [postQuery, userQuery]);

  if (postQuery.isLoading) {
    return (
      <Block flex={1} justify="center" align="center">
        <ActivityIndicator />
      </Block>
    );
  }

  const onChatNow = async () => {
    setProductTitle(postDetails.productName);
    setRecipientId(authorDetails._id);
    setSenderId(userQuery.data?.data?._id);

    navigation.navigate('Chat');
  };

  const onDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync(postId);
      toast.show('Request removed!', {
        type: 'success',
        placement: 'bottom',
        duration: 2000,
        animationType: 'slide-in',
      });
      navigation.goBack();
    } catch {
      /* @ts-ignore */
      toast.show(deletePostMutation.error.response.data.message, {
        type: 'danger',
        placement: 'bottom',
        duration: 2000,
        animationType: 'slide-in',
      });
    }
  };

  const promptDeletePost = () => {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to delete this request?',
      [
        {
          text: 'Yes',
          onPress: onDeletePost,
          style: 'destructive',
        },
        {
          text: 'No',
        },
      ],
    );
  };

  return (
    <Block safe marginTop={sizes.md}>
      <Image
        background
        resizeMode="cover"
        source={assets.whiteBg}
        /* @ts-ignore */
        height={sizes.height}>
        <Block
          scroll
          paddingHorizontal={sizes.s}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.padding}}>
          <Block flex={0} padding={sizes.s}>
            <Block flex={0} row justify="space-between" align="center">
              <Button
                row
                flex={0}
                justify="flex-start"
                onPress={() => navigation.goBack()}>
                <Image
                  radius={0}
                  /* @ts-ignore */
                  width={10}
                  height={18}
                  color={colors.text}
                  source={assets.arrow}
                  transform={[{rotate: '180deg'}]}
                />
                <Text h5 marginLeft={sizes.sm}>
                  {t('postDetails.title')}
                </Text>
              </Button>
              {isAuthorCurrentUser && (
                <TouchableOpacity onPress={promptDeletePost}>
                  <Feather
                    name="trash-2"
                    color={colors.danger}
                    size={sizes.socialIconSize}
                  />
                </TouchableOpacity>
              )}
            </Block>

            <Image
              source={
                postDetails?.productImage
                  ? {uri: postDetails.productImage}
                  : assets.noImage
              }
              resizeMode={postDetails?.productImage ? 'contain' : 'cover'}
              /* @ts-ignore */
              height={240}
              {...(!postDetails?.productImage && {width: sizes.width / 1.1})}
            />

            <Block marginVertical={sizes.s}>
              <Text h5 gradient={gradients.primary}>
                {t('postDetails.name')}
              </Text>
              <Text p marginVertical={sizes.s} transform="capitalize">
                {postDetails.productName}
              </Text>
            </Block>
            <Block marginVertical={sizes.s}>
              <Text h5 gradient={gradients.primary}>
                {t('postDetails.company')}
              </Text>
              <Text p marginVertical={sizes.s} transform="capitalize">
                {postDetails.productCompany}
              </Text>
            </Block>
            <Block marginVertical={sizes.s}>
              <Text h5 gradient={gradients.primary}>
                {t('postDetails.quantity')}
              </Text>
              <Text p marginVertical={sizes.s}>
                {postDetails.productQuantity}
              </Text>
            </Block>
            <Block marginVertical={sizes.s}>
              <Text h5 gradient={gradients.primary}>
                {t('postDetails.description')}
              </Text>
              <Text p marginVertical={sizes.s}>
                {postDetails.productDescription}
              </Text>
            </Block>
            <Block marginVertical={sizes.s}>
              <Text h5 gradient={gradients.primary}>
                {t('postDetails.category')}
              </Text>
              <Text p marginVertical={sizes.s} transform="uppercase">
                {postDetails.category}
              </Text>
            </Block>
            <Block marginVertical={sizes.s}>
              <Text h5 gradient={gradients.primary}>
                {t('postDetails.createdAt')}
              </Text>
              <Text p marginVertical={sizes.s}>
                {
                  /* @ts-ignore */
                  dayjs(postDetails?.createdAt).format('DD-MMM-YYYY hh:mm a')
                }
              </Text>
            </Block>
            <Block marginVertical={sizes.s}>
              <Text h5 gradient={gradients.primary}>
                {t('postDetails.tags')}
              </Text>
              <Text p marginVertical={sizes.s}>
                {postDetails?.tags?.length
                  ? postDetails?.tags?.join(', ')
                  : 'No tags found'}
              </Text>
            </Block>

            <Block marginBottom={sizes.xxl}>
              <Text h5 gradient={gradients.primary}>
                {t('postDetails.author')}
              </Text>
              <Block row justify="space-between" align="center">
                <Block row align="center">
                  <Text p margin={sizes.s}>
                    {authorDetails?.name}
                  </Text>
                  {authorDetails?.avatar !== '' && (
                    <Image
                      source={{uri: authorDetails?.avatar}}
                      /* @ts-ignore */
                      height={64}
                      width={64}
                      margin={sizes.s}
                    />
                  )}
                </Block>
                {!isAuthorCurrentUser && (
                  <Button
                    shadow={!isAndroid}
                    flex={0}
                    outlined
                    primary
                    paddingHorizontal={sizes.sm}>
                    <Text
                      p
                      bold
                      margin={sizes.s}
                      transform="uppercase"
                      color={colors.primary}
                      onPress={onChatNow}>
                      {t('postDetails.chatNow')}
                    </Text>
                  </Button>
                )}
              </Block>
            </Block>
          </Block>
        </Block>
      </Image>
    </Block>
  );
};

export default PostDetails;
