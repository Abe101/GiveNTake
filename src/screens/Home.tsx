import React, {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQueries} from '@tanstack/react-query';
import {ActivityIndicator} from 'react-native';

import {useDebounce, useTheme, useTranslation} from '../hooks/';
import {Block, Image, Input, Product, Text} from '../components/';
import {getLatestPosts, searchPostsByName} from '../services';
import {usePostStore} from '../store';
import {PostState} from '../store/usePostStore';

const Home = () => {
  const {t} = useTranslation();
  const {assets, sizes, colors} = useTheme();
  const navigation = useNavigation();
  const [allPosts, setAllPosts] = useState([]);
  const [setPostId, setPostEmail] = usePostStore((state: PostState) => [
    state.setId,
    state.setEmail,
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [postsQuery, searchPostsQuery] = useQueries({
    queries: [
      {
        queryKey: ['posts'],
        queryFn: async () => {
          const data = await getLatestPosts(100);
          return data;
        },
      },
      {
        queryKey: ['searchPosts', debouncedSearchTerm],
        queryFn: () => searchPostsByName(debouncedSearchTerm),
        enabled: debouncedSearchTerm !== '',
      },
    ],
  });

  useFocusEffect(
    useCallback(() => {
      if (postsQuery.isSuccess) {
        setAllPosts(postsQuery.data?.data);
      }
    }, [postsQuery.data, postsQuery.isSuccess]),
  );

  const onPostPress = (post: any) => {
    setPostId(post._id);
    setPostEmail(post.authorEmail);

    navigation.navigate('PostDetails');
  };

  if (postsQuery.isLoading) {
    return (
      <Block flex={1} justify="center" align="center">
        <ActivityIndicator />
      </Block>
    );
  }

  return (
    <Block safe>
      <Image
        background
        resizeMode="cover"
        marginTop={-1}
        source={assets.screenBg}
        /* @ts-ignore */
        height={sizes.height}>
        {/* search input */}
        <Block flex={0} padding={sizes.padding}>
          <Input
            search
            placeholder={t('common.search')}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </Block>

        {debouncedSearchTerm !== '' && searchPostsQuery.isSuccess && (
          <Block flex={0} row align="center" paddingHorizontal={sizes.m}>
            <Text color={colors.light} bold h5>
              {t('home.resultsFound', {
                count: `${searchPostsQuery.data?.data?.length}`,
              })}
            </Text>
          </Block>
        )}

        {/* products list */}
        <Block
          scroll
          paddingHorizontal={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.l}}>
          <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            {debouncedSearchTerm !== '' ? (
              searchPostsQuery.isFetching ? (
                <Block flex={1} justify="center" align="center">
                  <ActivityIndicator />
                </Block>
              ) : (
                searchPostsQuery.data.data?.map((post: any, idx: number) => {
                  return (
                    <Product
                      key={`card-${post._id}`}
                      {...(post.productImage && {image: post.productImage})}
                      title={post.productName}
                      description={post.productDescription}
                      type={idx % 3 === 0 ? 'horizontal' : 'vertical'}
                      linkLabel="See details"
                      onLinkPress={() => onPostPress(post)}
                    />
                  );
                })
              )
            ) : (
              allPosts?.map((post: any, idx: number) => {
                return (
                  <Product
                    key={`card-${post._id}`}
                    {...(post.productImage && {image: post.productImage})}
                    title={post.productName}
                    description={post.productDescription}
                    type={idx % 3 === 0 ? 'horizontal' : 'vertical'}
                    linkLabel="See details"
                    onLinkPress={() => onPostPress(post)}
                  />
                );
              })
            )}
          </Block>
        </Block>
      </Image>
    </Block>
  );
};

export default Home;
