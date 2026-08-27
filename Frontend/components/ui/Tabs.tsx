import React, { createContext, useContext, useState } from 'react';
import { View, Text, Pressable, ViewProps, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface TabsContextType {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
}

interface TabsProps extends ViewProps {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
    style,
    ...props
}: TabsProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = controlledValue ?? uncontrolledValue;

    const handleValueChange = (newValue: string) => {
        setUncontrolledValue(newValue);
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <View style={[styles.tabs, style]} {...props}>
                {children}
            </View>
        </TabsContext.Provider>
    );
}

interface TabsListProps extends ViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function TabsList({ children, style, ...props }: TabsListProps) {
    return (
        <View style={[styles.tabsList, style]} {...props}>
            {children}
        </View>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function TabsTrigger({ value, children, style, textStyle }: TabsTriggerProps) {
    const { value: selectedValue, onValueChange } = useTabsContext();
    const isActive = selectedValue === value;

    return (
        <Pressable
            onPress={() => onValueChange(value)}
            style={[styles.tabsTrigger, isActive && styles.tabsTriggerActive, style]}
        >
            {typeof children === 'string' ? (
                <Text style={[styles.tabsTriggerText, isActive && styles.tabsTriggerTextActive, textStyle]}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
}

interface TabsContentProps extends ViewProps {
    value: string;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function TabsContent({ value, children, style, ...props }: TabsContentProps) {
    const { value: selectedValue } = useTabsContext();

    if (value !== selectedValue) {
        return null;
    }

    return (
        <View style={[styles.tabsContent, style]} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'column',
        gap: 8,
    },
    tabsList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        padding: 4,
    },
    tabsTrigger: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'transparent',
    },
    tabsTriggerActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabsTriggerText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    tabsTriggerTextActive: {
        color: '#0f172a',
        fontWeight: '600',
    },
    tabsContent: {
        flex: 1,
    },
});
