import * as React from "react";
import {
  ViewStyle,
  ListRenderItemInfo,
  SectionListRenderItemInfo,
  SectionListData,
  StyleProp,
  RefreshControlProps,
  SectionListProps,
  FlatListProps
} from 'react-native'

// Copy from TS 3.5
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

// Grid item info, same as original + rowIndex
export type GridRenderItemInfo<ItemT> = ListRenderItemInfo<ItemT> & {
  rowIndex: number;
}

export type GridRenderItem<ItemT> = (
  info: GridRenderItemInfo<ItemT>
) => React.ReactElement | null;

// Custom props that are present in both grid and list
type CommonProps = {

  /**
   * Function to render each object. Should return a react native component.
   */
  renderItem: GridRenderItem<ItemType>;

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
}

// Original flat list component props
type FlatListAllowedProps<ItemType = any> = Omit<FlatListProps<ItemType>,
  | "data"
  | "renderItem"
>

/**
 * React Native Super Grid Properties
 */
export interface FlatGridProps<ItemType = any>
  extends FlatListAllowedProps<ItemType>, CommonProps {

  /**
   * Items to be rendered. renderItem will be called with each item in this array.
   */
  items: ItemType[];

  /**
   * Specifies the style about content row view
   */
  itemContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Responsive Grid View for React Native.
 */
export class FlatGrid<ItemType = any> extends React.Component<
  FlatGridProps<ItemType>
> {}

export type SectionItem<ItemType> = {
  title: string;
  data: ItemType[];
}

// Original section list component props
type SectionGridAllowedProps<ItemType = any> = Omit<SectionListProps<ItemType>,
  | "renderItem"
  //  This prop doesn't affect the SectionGrid, which only scrolls vertically.
  | "horizontal"
>

export interface SectionGridProps<ItemType = any>
  extends SectionGridAllowedProps<ItemType>, CommonProps {

  sections: SectionItem<ItemType>[];
}

export class SectionGrid<ItemType = any> extends React.Component<
  SectionGridProps<ItemType>
> {}
