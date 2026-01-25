export type ClickEvent<T extends HTMLElement = HTMLElement> = MouseEvent & {
  currentTarget: T;
};

export type BlurEvent<T extends HTMLElement = HTMLInputElement> = FocusEvent & {
  currentTarget: T;
  target: T;
};

export type FocusEventType<T extends HTMLElement = HTMLInputElement> = FocusEvent & {
  currentTarget: T;
  target: T;
};

export type ClickEventType<T extends HTMLElement = HTMLInputElement> = MouseEvent & {
  currentTarget: T;
  target: T;
};

export type ChangeEventType<T extends HTMLElement = HTMLInputElement> = Event & {
  currentTarget: T;
  target: T;
};

export type InputEventType<T extends HTMLElement = HTMLInputElement> = InputEvent & {
  currentTarget: T;
  target: T;
};

export type KeyDownEventType<T extends HTMLElement = HTMLInputElement> = KeyboardEvent & {
  currentTarget: T;
  target: T;
};

export type SubmitEventType<T extends HTMLElement = HTMLFormElement> = Event & {
  currentTarget: T;
  target: T;
};
