import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {useQueries} from '@tanstack/react-query';

import {useTheme} from '../hooks/';
import {Block, Button, Article, Text} from '../components/';
import {getCategories, getPostsByCategory} from '../services';
import {usePostStore} from '../store';
import {PostState} from '../store/usePostStore';

const Categories = () => {
  const navigation = useNavigation();
  const {colors, gradients, sizes} = useTheme();
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('Grocery');
  const [categoriesQuery, postsByCategoryQuery] = useQueries({
    queries: [
      {
        queryKey: ['categories'],
        queryFn: getCategories,
      },
      {
        queryKey: ['posts', selected],
        queryFn: async () => {
          const response = await getPostsByCategory(selected);
          return response;
        },
        enabled: selected !== '',
      },
    ],
  });
  const [setPostId, setAuthorEmail] = usePostStore((state: PostState) => [
    state.setId,
    state.setEmail,
  ]);

  useEffect(() => {
    if (categoriesQuery.isSuccess) {
      setCategories(categoriesQuery.data.data);
    }
  }, [categoriesQuery]);

  const listEmpty = (category: string) => {
    return (
      <Block flex={0} justify="center" align="center">
        <Text>No requests found for {category}</Text>
      </Block>
    );
  };

  return (
    <Block>
      {/* categories list */}
      <Block
        color={colors.secondary}
        row
        flex={0}
        paddingVertical={sizes.padding}>
        <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          {categories?.map((category, idx) => {
            const isSelected = category === selected;
            return (
              <Button
                radius={sizes.m}
                marginHorizontal={sizes.s}
                key={`category-${idx}}`}
                onPress={() => setSelected(category)}
                gradient={gradients?.[isSelected ? 'primary' : 'light']}>
                <Text
                  p
                  bold={isSelected}
                  white={isSelected}
                  black={!isSelected}
                  transform="capitalize"
                  marginHorizontal={sizes.m}>
                  {category}
                </Text>
              </Button>
            );
          })}
        </Block>
      </Block>

      {postsByCategoryQuery.isLoading && (
        <Block flex={1} justify="center" align="center">
          <ActivityIndicator />
        </Block>
      )}
      <FlatList
        data={postsByCategoryQuery.data?.data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        ListEmptyComponent={
          !postsByCategoryQuery.isFetching ? listEmpty(selected) : null
        }
        renderItem={({item}) => {
          const articleProps = {
            title: item.productName,
            description: item.productDescription,
            ...(item.productImage && {image: item.productImage}),
            category: item.category,
            timestamp: item.createdAt,
            onPress: () => {
              setPostId(item._id);
              setAuthorEmail(item.authorEmail);

              navigation.navigate('PostDetails');
            },
          };

          return <Article {...articleProps} />;
        }}
        refreshControl={
          <RefreshControl
            refreshing={postsByCategoryQuery.isRefetching}
            onRefresh={postsByCategoryQuery.refetch}
          />
        }
      />
    </Block>
  );
};

export default Categories;
