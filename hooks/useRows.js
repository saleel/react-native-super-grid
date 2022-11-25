import { useCallback, useEffect } from 'react';
import { chunkArray } from '../utils';


const useRows = ({
  data, itemsPerRow, invertedRow, keyExtractor, onItemsPerRowChange,
}) => {
  let rows = chunkArray(data, itemsPerRow); // Splitting the data into rows

  if (invertedRow) {
    rows = rows.map(r => r.reverse());
  }

  const localKeyExtractor = useCallback(
    (rowItems, index) => {
      if (keyExtractor) {
        return rowItems
          .map((rowItem, rowItemIndex) => keyExtractor(rowItem, rowItemIndex))
          .join('_');
      }
      return `row_${index}`;
    },
    [keyExtractor],
  );

  useEffect(() => {
    if (onItemsPerRowChange) {
      onItemsPerRowChange(itemsPerRow);
    }
  }, [itemsPerRow]);

  return { rows, keyExtractor: localKeyExtractor };
};

export default useRows;
