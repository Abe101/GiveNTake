import React, {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQueries} from '@tanstack/react-query';
import {ActivityIndicator, FlatList} from 'react-native';

import {
  useDebounce,
  useRefetchOnFocus,
  useTheme,
  useTranslation,
} from '../hooks/';
import {Block, Image, Input, Product, Text} from '../components/';
import {getLatestPosts, searchPostsByName} from '../services';
import {usePostStore} from '../store';
import {PostState} from '../store/usePostStore';

const Home = () => {
  const {t} = useTranslation();
  const {assets, sizes, colors} = useTheme();
  const navigation = useNavigation();
  const [allPosts, setAllPosts] = useState<any[]>([]);
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
  useRefetchOnFocus(postsQuery.refetch);

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
          contentContainerStyle={{paddingBottom: sizes.xxl * 4}}>
          {debouncedSearchTerm !== '' ? (
            searchPostsQuery.isFetching ? (
              <Block flex={1} justify="center" align="center">
                <ActivityIndicator />
              </Block>
            ) : (
              <FlatList
                data={searchPostsQuery.data?.data}
                keyExtractor={(post) => post._id}
                renderItem={({item: post}) => {
                  return (
                    <Product
                      {...(post.productImage && {image: post.productImage})}
                      title={post.productName}
                      description={post.productDescription}
                      type={'horizontal'}
                      linkLabel="See details"
                      onLinkPress={() => onPostPress(post)}
                    />
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            )
          ) : (
            <FlatList
              data={allPosts}
              keyExtractor={(post) => post?._id}
              renderItem={({item: post}) => {
                return (
                  <Product
                    {...(post.productImage && {image: post.productImage})}
                    title={post.productName}
                    description={post.productDescription}
                    type={'horizontal'}
                    linkLabel="See details"
                    onLinkPress={() => onPostPress(post)}
                  />
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Block>
      </Image>
    </Block>
  );
};

export default Home;
