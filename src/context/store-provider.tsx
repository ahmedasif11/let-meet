import { Provider } from 'react-redux';
import store from '@/lib/store/redux/store';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};
