// navigation/NavigationService.ts
import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

let pendingNavigation:
  | {
      name: keyof RootStackParamList;
      params: RootStackParamList[keyof RootStackParamList];
    }
  | null = null;

export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params: RootStackParamList[RouteName]
) {
  if (!navigationRef.isReady()) {
    pendingNavigation = { name, params };
    return;
  }

  navigationRef.dispatch(
    StackActions.push(name as string, params)
  );
}

export function flushNavigationQueue() {
  if (!pendingNavigation || !navigationRef.isReady()) {
    return;
  }

  const { name, params } = pendingNavigation;
  pendingNavigation = null;

  navigationRef.dispatch(
    StackActions.push(name as string, params)
  );
}
