export interface WindowState {
  id: string;
  title: string;
  icon: string;
  app: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
}

export interface AppDef {
  id: string;
  name: string;
  icon: string;
  component: string;
}
