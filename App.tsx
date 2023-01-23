import 'react-native-gesture-handler';
import React from 'react';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';

import {DataProvider, TranslationProvider, SocketProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';

const client = new QueryClient();

export default function App() {
  return (
    <DataProvider>
      <QueryClientProvider client={client}>
        <TranslationProvider>
          <SocketProvider>
            <AppNavigation />
          </SocketProvider>
        </TranslationProvider>
      </QueryClientProvider>
    </DataProvider>
  );
}
