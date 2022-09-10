import * as React from "react";
import {
  ViewStyle,
  ListRenderItemInfo,
  SectionListRenderItemInfo,
  SectionListData,
  StyleProp,
  RefreshControlProps,
  SectionList,
  SectionListProps,
  FlatList,
  FlatListProps
} from "react-native"

// Copy from TS 3.5
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

// Grid item info, same as original + rowIndex
export type GridRenderItemInfo<ItemT> = ListRenderItemInfo<ItemT> & {
  rowIndex: number;
}

export type SectionGridRenderItemInfo<ItemT> = SectionListRenderItemInfo<ItemT> & {
  rowIndex: number;
}

export type GridRenderItem<ItemT> = (
  info: GridRenderItemInfo<ItemT>
) => React.ReactElement | null;

export type SectionGridRenderItem<ItemT> = (
  info: SectionGridRenderItemInfo<ItemT>
) => React.ReactElement | null;

// Custom props that are present in both grid and list
type CommonProps<ItemType> = {
  /**
   * Additional styles for rows (rows render multiple items within), apart from the generated ones.
   */
  additionalRowStyle?: StyleProp<ViewStyle>;

  /**
   * Minimum width or height for each item in pixels (virtual).
   */
  itemDimension?: number;

  /**
   * If true, the exact itemDimension will be used and won't be adjusted to fit the screen.
   */
  fixed?: boolean;

  /**
   * Spacing between each item.
   */
  spacing?: number;

  /**
   * Specifies a static width or height for the GridView container.
   * If your container dimension is known or can be calculated at runtime
   * (via Dimensions.get('window'), for example), passing this prop will force the grid container
   * to that dimension size and avoid the reflow associated with dynamically calculating it
   */
  staticDimension?: number;

  /**
   * Specifies a maximum width or height for the container. If not passed, full width/height
   * of the screen will be used.
   */
  maxDimension?: number; 
  
  /**
   * Specifies the style about content row view
   */
  itemContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Reverses the direction of each row item. It can be used with the [`inverted`](https://reactnative.dev/docs/flatlist#inverted) property.
   * ex) [0, 1, 2] -> [2, 1, 0]
   */
   invertedRow?: boolean;
  
  /**
   * Specifies the maximum items to render per row
   */
   maxItemsPerRow?: number;
  
  /**
   * When set to true the library will calcualte the total dimensions taking into account padding in style prop, and padding + maxWidth/maxHeight in contentContainerStyle prop
   */
   adjustGridToStyles?: boolean;

  /**
   * When number of items per row is determined, this callback is called.
   * @param itemsPerRow Number of items per row
   */
  onItemsPerRowChange?: (itemsPerRow: number) => void;
}

/**
 * React Native Super Grid Properties
 */
export interface FlatGridProps<ItemType = any>
  extends FlatListProps<ItemType>, CommonProps<ItemType> {
  /**
   * Items to be rendered. renderItem will be called with each item in this array.
   */
   data: ItemType[];

  /**
   * Overwrites FlatList with custom interface
   */
   customFlatList?: typeof FlatList;
}

/**
 * Responsive Grid View for React Native.
 */
export function FlatGrid<ItemType = any>(
  props: React.PropsWithoutRef<FlatGridProps<ItemType>> & React.RefAttributes<FlatList<ItemType>>
): React.ReactElement

export type SectionItem<ItemType> = {
  title?: string;
  data: ItemType[];
  renderItem?: SectionGridRenderItem<ItemType>;
}

// Original section list component props
type SectionGridAllowedProps<ItemType = any> = Omit<SectionListProps<ItemType>,
  //  This prop doesn't affect the SectionGrid, which only scrolls vertically.
  | "horizontal" | "sections" | "renderItem"
>

export interface SectionGridProps<ItemType = any>
  extends SectionGridAllowedProps<ItemType>, CommonProps<ItemType> {
   sections: SectionItem<ItemType>[];

   renderItem?: SectionGridRenderItem<ItemType>;

  /**
   * Overwrites SectionList with custom interface
   */
   customSectionList?: typeof SectionList;
}

export function SectionGrid<ItemType = any>(
  props: React.PropsWithoutRef<SectionGridProps<ItemType>> & React.RefAttributes<SectionList<ItemType>>
): React.ReactElement
