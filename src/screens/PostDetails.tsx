import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';

import {Block, Text, Image, Button} from '../components';
import {useTheme, useTranslation} from '../hooks';
import {usePostStore} from '../store';
import {getPostById} from '../services';
import {PostState} from '../store/usePostStore';
import {IPost} from '../components/Forms/RequestForm';

const PostDetails = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {sizes, assets, colors, gradients} = useTheme();
  const [postId] = usePostStore((state: PostState) => [state.id]);
  const postQuery = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPostById(postId),
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
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (postQuery.isSuccess) {
      setPostDetails(postQuery.data.data.data.postDetails);
      setUserDetails(postQuery.data.data.data.authorDetails);
    }
  }, [postQuery]);

  if (postQuery.isLoading) {
    return (
      <Block flex={1} justify="center" align="center">
        <ActivityIndicator />
      </Block>
    );
  }

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
                    {
                      /* @ts-ignore */
                      userDetails?.name
                    }
                  </Text>
                  {
                    /* @ts-ignore */
                    userDetails?.avatar !== '' && (
                      <Image
                        /* @ts-ignore */
                        source={{uri: userDetails?.avatar}}
                        /* @ts-ignore */
                        height={64}
                        width={64}
                        margin={sizes.s}
                      />
                    )
                  }
                </Block>
                <Button flex={0} outlined primary paddingHorizontal={sizes.sm}>
                  <Text
                    p
                    bold
                    margin={sizes.s}
                    transform="uppercase"
                    color={colors.primary}>
                    {t('postDetails.chatNow')}
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </Image>
    </Block>
  );
};

export default PostDetails;
