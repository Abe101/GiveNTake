import {useFocusEffect} from '@react-navigation/native';

const useRefetchOnFocus = (refetch: () => void) => {
  useFocusEffect(() => {
    refetch();
  });
};

export default useRefetchOnFocus;
