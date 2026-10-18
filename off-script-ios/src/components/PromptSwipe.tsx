import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  PanResponder,
  Platform,
  View,
  useWindowDimensions,
} from "react-native";
import { swipeDirection } from "../domain/prompt-navigation";

const SwipeBlockContext = createContext<(() => void) | undefined>(undefined);

export function PromptSwipeControl({ children }: { children: ReactNode }) {
  const block = useContext(SwipeBlockContext);
  return <View onTouchStart={block}>{children}</View>;
}

export function PromptSwipe({
  children,
  disabled = false,
  onPrevious,
  onNext,
}: {
  children: ReactNode;
  disabled?: boolean;
  onPrevious?: () => void;
  onNext: () => void;
}) {
  const { width } = useWindowDimensions();
  const surface = useRef<View>(null);
  const blocked = useRef(false);
  const consumedAt = useRef(0);
  const origin = useRef({ x: 0, y: 0 });
  const latest = useRef({ width, disabled, onPrevious, onNext });
  useLayoutEffect(() => {
    latest.current = { width, disabled, onPrevious, onNext };
  }, [width, disabled, onPrevious, onNext]);
  useEffect(() => {
    const node: unknown = surface.current;
    if (Platform.OS !== "web" || !(node instanceof HTMLElement)) return;
    const suppressClick = (event: MouseEvent) => {
      if (Date.now() - consumedAt.current < 350) {
        event.preventDefault();
        event.stopPropagation();
        consumedAt.current = 0;
      }
    };
    // Browser text selection otherwise cancels the responder partway through a drag.
    const suppressSelection = (event: Event) => {
      if (!latest.current.disabled && !blocked.current) event.preventDefault();
    };
    node.addEventListener("click", suppressClick, true);
    node.addEventListener("selectstart", suppressSelection);
    return () => {
      node.removeEventListener("click", suppressClick, true);
      node.removeEventListener("selectstart", suppressSelection);
    };
  }, []);
  // PanResponder stores these callbacks; their refs are read only on input events.
  // eslint-disable-next-line react-hooks/refs
  const [responder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (event) => {
        const { width, disabled } = latest.current;
        const target: unknown = event.nativeEvent.target;
        origin.current = {
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        };
        const edge =
          event.nativeEvent.pageX < 24 || event.nativeEvent.pageX > width - 24;
        blocked.current =
          disabled ||
          edge ||
          event.nativeEvent.touches.length !== 1 ||
          (Platform.OS === "web" &&
            target instanceof Element &&
            !!target.closest(
              '[role="button"],[role="switch"],[role="link"],button,a,input,textarea,select',
            ));
        consumedAt.current = 0;
        return false;
      },
      onMoveShouldSetPanResponderCapture: (_event, gesture) => {
        if (gesture.numberActiveTouches !== 1) blocked.current = true;
        if (latest.current.disabled || blocked.current) return false;
        const direction = swipeDirection(
          gesture.dx,
          gesture.dy,
          gesture.numberActiveTouches,
        );
        return (
          direction !== null && (direction === 1 || !!latest.current.onPrevious)
        );
      },
      onPanResponderMove: (_event, gesture) => {
        if (gesture.numberActiveTouches !== 1) blocked.current = true;
      },
      onPanResponderStart: (_event, gesture) => {
        if (gesture.numberActiveTouches !== 1) blocked.current = true;
      },
      onPanResponderRelease: (event) => {
        const { disabled, onPrevious, onNext } = latest.current;
        if (disabled || blocked.current) return;
        const direction = swipeDirection(
          event.nativeEvent.pageX - origin.current.x,
          event.nativeEvent.pageY - origin.current.y,
        );
        if (direction !== null) consumedAt.current = Date.now();
        if (direction === -1) onPrevious?.();
        else if (direction === 1) onNext();
      },
      onPanResponderTerminationRequest: () => true,
    }),
  );
  return (
    <SwipeBlockContext.Provider
      value={() => {
        blocked.current = true;
      }}
    >
      <View
        ref={surface}
        testID="prompt-swipe-surface"
        {...responder.panHandlers}
      >
        {children}
      </View>
    </SwipeBlockContext.Provider>
  );
}
