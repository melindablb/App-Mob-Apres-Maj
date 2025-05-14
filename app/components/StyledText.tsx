import React from "react";
import { Text, TextStyle } from "react-native";

interface StyledTextProps {
    children: React.ReactNode;
    style?: TextStyle;
    big?: boolean;
    small?: boolean;
}

const StyledText: React.FC<StyledTextProps> = ({ children, style, big, small }) => {
    const textStyle: TextStyle = {
        fontSize: big ? 20 : small ? 12 : 16,
        fontWeight: "bold",
        ...style,
    };

    return <Text style={textStyle}>{children}</Text>;
};

export default StyledText;