import React, {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';

import {useTheme, useTranslation} from '../hooks/';
import {Block, Image, Input, Product} from '../components/';
import {getLatestPosts} from '../services';
import {usePostStore} from '../store';
import {PostState} from '../store/usePostStore';

const Home = () => {
  const {t} = useTranslation();
  const {assets, sizes} = useTheme();
  const navigation = useNavigation();
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const data = await getLatestPosts(100);
      return data;
    },
  });
  const [products, setProducts] = useState([]);
  const [setPostId, setPostEmail] = usePostStore((state: PostState) => [
    state.setId,
    state.setEmail,
  ]);

  useFocusEffect(
    useCallback(() => {
      if (postsQuery.isSuccess) {
        setProducts(postsQuery.data?.data);
      }
    }, [postsQuery.data, postsQuery.isSuccess]),
  );

  const onProductPress = (product: any) => {
    setPostId(product._id);
    setPostEmail(product.authorEmail);

    navigation.navigate('PostDetails');
  };

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
          <Input search placeholder={t('common.search')} />
        </Block>

        {/* products list */}
        <Block
          scroll
          paddingHorizontal={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.l}}>
          <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            {products?.map((product: any, idx: number) => {
              return (
                <Product
                  key={`card-${product._id}`}
                  {...(product.productImage && {image: product.productImage})}
                  title={product.productName}
                  description={product.productDescription}
                  type={idx % 3 === 0 ? 'horizontal' : 'vertical'}
                  linkLabel="See details"
                  onLinkPress={() => onProductPress(product)}
                />
              );
            })}
          </Block>
        </Block>
      </Image>
    </Block>
  );
};

export default Home;
