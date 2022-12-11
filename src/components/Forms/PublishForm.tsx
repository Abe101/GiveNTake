import React from 'react';
import {Block, Text} from '../../components';
import {useTheme, useTranslation} from '../../hooks';

const PublishForm = () => {
  const {sizes} = useTheme();
  const {t} = useTranslation();

  return (
    <Block>
      <Text black h3>
        {t('publish.formTitle')}
      </Text>
    </Block>
  );
};

export default PublishForm;
