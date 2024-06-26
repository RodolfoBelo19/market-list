import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient, PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import localforage from "localforage";
import { MarketList } from "./presentation/components/MarketList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const localStoragePersister = {
  persistClient: async (client: any) => {
    try {
      await localforage.setItem("react-query", client);
    } catch (err) {
      console.error(err);
    }
  },
  restoreClient: async () => {
    try {
      return await localforage.getItem("react-query");
    } catch (err) {
      console.error(err);
    }
  },
  removeClient: async () => {
    try {
      await localforage.removeItem("react-query");
    } catch (err) {
      console.error(err);
    }
  },
};

persistQueryClient({
  queryClient,
  persister: localStoragePersister as any,
  dehydrateOptions: {
    shouldDehydrateQuery: () => true,
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister as any,
      }}
    >
      <MarketList />
    </PersistQueryClientProvider>
  </QueryClientProvider>
);

export default App;
