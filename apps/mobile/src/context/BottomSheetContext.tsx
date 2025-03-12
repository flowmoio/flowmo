import BottomSheet from '@gorhom/bottom-sheet';
import {
  FC,
  PropsWithChildren,
  RefObject,
  createContext,
  useContext,
  useRef,
} from 'react';

type BottomSheetContextType = {
  bottomSheetRef: RefObject<BottomSheet>;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export const BottomSheetProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
