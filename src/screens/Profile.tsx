import React, {useState, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import {useQueries} from '@tanstack/react-query';

import {Block, Button, Image, Text, Product} from '../components/';
import {useTheme, useTranslation} from '../hooks/';
import {getPostsByUser, getUserProfile} from '../services';
import {IPost} from '../components/Forms/PublishForm';
import {usePostStore} from '../store';
import {PostState} from '../store/usePostStore';

const Profile = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();
  const [userDetails, setUserDetails] = useState({});
  const [userPosts, setUserPosts] = useState<Array<Partial<IPost>>>([]);
  const [userQuery, postsQuery] = useQueries({
    queries: [
      {
        queryKey: ['user'],
        queryFn: getUserProfile,
      },
      {
        /* @ts-ignore */
        queryKey: ['posts', userDetails?.email],
        /* @ts-ignore */
        queryFn: () => getPostsByUser(userDetails?.email),
        enabled: Object.keys(userDetails).length !== 0,
      },
    ],
  });
  const [setPostId, setAuthorEmail] = usePostStore((state: PostState) => [
    state.setId,
    state.setEmail,
  ]);

  useEffect(() => {
    if (userQuery.isSuccess) {
      setUserDetails(userQuery.data.data);
    }
  }, [userQuery]);

  useEffect(() => {
    if (postsQuery.isSuccess) {
      setUserPosts(postsQuery.data.data);
    }
  }, [postsQuery]);

  return (
    <Block safe marginTop={sizes.md} color={colors.secondary}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.buttonRadius}
            source={assets.screenBg}>
            <Block flex={1} row justify="space-between" align="center">
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
                  color={colors.white}
                  source={assets.arrow}
                  transform={[{rotate: '180deg'}]}
                />
                <Text p white marginLeft={sizes.s}>
                  {t('profile.title')}
                </Text>
              </Button>
              <Button
                row
                flex={0}
                justify="flex-end"
                onPress={() => navigation.navigate('ProfileSettings')}>
                <Ionicons name="settings" color={colors.white} size={20} />
              </Button>
            </Block>
            <Block flex={0} align="center">
              <Image
                /* @ts-ignore */
                width={64}
                height={64}
                marginBottom={sizes.sm}
                source={{
                  uri:
                    /* @ts-ignore */
                    userDetails?.avatar ??
                    /* @ts-ignore */
                    `https://api.dicebear.com/5.x/lorelei-neutral/svg?seed=${userDetails?.name}`,
                }}
              />
              <Text h5 center color={colors.text}>
                {
                  /* @ts-ignore */
                  userDetails?.name
                }
              </Text>
              <Text p center color={colors.text}>
                {
                  /* @ts-ignore */
                  userDetails?.email
                }
              </Text>
            </Block>
          </Image>

          {/* profile: about me */}
          <Block paddingHorizontal={sizes.sm}>
            <Text h5 semibold marginBottom={sizes.s} marginTop={sizes.sm}>
              {t('profile.aboutMe')}
            </Text>
            <Text p lineHeight={26}>
              {
                /* @ts-ignore */
                userDetails?.about ?? 'No about me provided'
              }
            </Text>
          </Block>

          {/* profile: posts */}
          <Block paddingHorizontal={sizes.sm} marginTop={sizes.s}>
            <Block
              row
              align="center"
              justify="flex-start"
              marginVertical={sizes.s}>
              <Text h5 semibold>
                {t('profile.posts')}
              </Text>
            </Block>

            {postsQuery.isLoading ? (
              <Block justify="center" align="center">
                <ActivityIndicator />
              </Block>
            ) : (
              <Block
                scroll
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.l}}>
                <Block
                  row
                  wrap="wrap"
                  justify="space-between"
                  marginTop={sizes.sm}>
                  {userPosts?.map((product: any) => {
                    return (
                      <Product
                        key={`card-${product._id}`}
                        {...(product.productImage && {
                          image: product.productImage,
                        })}
                        title={product.productName}
                        description={product.productDescription}
                        type={'vertical'}
                        linkLabel="See details"
                        onLinkPress={() => {
                          /* @ts-ignore */
                          setPostId(product._id);
                          /* @ts-ignore */
                          setAuthorEmail(product.authorEmail);

                          navigation.navigate('PostDetails');
                        }}
                      />
                    );
                  })}
                </Block>
              </Block>
            )}
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
