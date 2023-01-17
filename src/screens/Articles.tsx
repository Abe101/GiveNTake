import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useQueries} from '@tanstack/react-query';

import {useTheme} from '../hooks/';
import {Block, Button, Article, Text} from '../components/';
import {getCategories, getPostsByCategory} from '../services';

const Articles = () => {
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

  useEffect(() => {
    if (categoriesQuery.isSuccess) {
      setCategories(categoriesQuery.data.data);
    }
  }, [categoriesQuery]);

  const listEmpty = (category: string) => {
    return (
      <Block flex={0} justify="center" align="center">
        <Text>No posts found for {category}</Text>
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

      {postsByCategoryQuery.isSuccess && (
        <FlatList
          data={postsByCategoryQuery.data?.data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, idx) => idx.toString()}
          style={{paddingHorizontal: sizes.padding}}
          contentContainerStyle={{paddingBottom: sizes.l}}
          ListEmptyComponent={listEmpty(selected)}
          renderItem={({item}) => {
            const articleProps = {
              title: item.productName,
              description: item.productDescription,
              ...(item.productImage && {image: item.productImage}),
              category: item.category,
              timestamp: item.createdAt,
              onPress: () => {},
            };

            return <Article {...articleProps} />;
          }}
        />
      )}
    </Block>
  );
};

export default Articles;
