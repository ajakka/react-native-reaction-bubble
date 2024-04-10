import { useState } from "react";
import {
  LayoutRectangle,
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  ZoomIn,
  ZoomOut,
  CurvedTransition,
  BounceIn,
  BounceOut,
} from "react-native-reanimated";

export type ReactionBubbleProps = PressableProps & {
  reactions: string[];
  selectedReaction: string | undefined;
  onReactionPress: (reaction: string) => void;

  style?: ViewStyle;
  bubbleStyle?: ViewStyle;
  reactionStyle?: TextStyle;
  highlightColor: string | undefined;
  children: React.ReactNode;
};

export default function ReactionBubble(props: ReactionBubbleProps) {
  const {
    reactions,
    selectedReaction,
    onReactionPress,

    style,
    bubbleStyle,
    reactionStyle,
    highlightColor,
    children,
  } = props;

  const [childLayout, setChildLayout] = useState<LayoutRectangle | undefined>();
  const [isReactionsShown, setShowReaction] = useState(false);

  const handleLongPress = () => {
    setShowReaction(true);
  };

  const handleReactionPress = (reaction: string) => {
    setShowReaction(false);
    onReactionPress(reaction);
  };

  const handleReactionRemovePress = () => {
    onReactionPress(undefined);
  };

  return (
    <Animated.View>
      {isReactionsShown && (
        <Animated.View
          layout={CurvedTransition}
          entering={ZoomIn.duration(300)}
          exiting={ZoomOut.duration(200)}
          style={[
            bubbleStyle,
            containerStyle,
            { position: "absolute", bottom: childLayout?.height || 0 },
          ]}
        >
          {reactions.map((reaction, index) => (
            <Pressable
              key={index}
              style={{ padding: 4 }}
              onPress={() => handleReactionPress(reaction)}
            >
              <Animated.Text
                entering={ZoomIn.delay((index + 1) * 60).duration(150)}
                style={[{ padding: 0, fontSize: 28 }]}
              >
                {reaction}
              </Animated.Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
      <View
        style={{ alignItems: "flex-start" }}
        onLayout={(e) => void setChildLayout(e.nativeEvent.layout)}
      >
        <Pressable
          onLongPress={handleLongPress}
          {...props}
          style={({ pressed }) => [
            style,
            {
              backgroundColor: pressed
                ? highlightColor
                : props.style.backgroundColor,
            },
          ]}
        >
          {children}
        </Pressable>
        {selectedReaction && (
          <Pressable onPress={() => handleReactionRemovePress()}>
            <Animated.View
              layout={CurvedTransition}
              entering={BounceIn.damping(0.5).duration(100)}
              exiting={BounceOut.damping(0.5).duration(100)}
              style={[miniReactionStyle, reactionStyle]}
            >
              <Animated.Text>{selectedReaction}</Animated.Text>
            </Animated.View>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const { containerStyle, miniReactionStyle } = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 100,
    margin: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  miniReactionStyle: {
    top: -4,
    marginStart: 8,
    padding: 3,
    borderRadius: 20,
    borderColor: "#0C151B",
    borderWidth: 1,
  },
});
