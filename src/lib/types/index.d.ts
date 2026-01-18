export type ClickEvent<T extends HTMLElement = HTMLElement> = MouseEvent & {
  currentTarget: T;
};
