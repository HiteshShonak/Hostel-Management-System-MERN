import React, { createContext, useContext, useState } from 'react';
import { View, Text, Pressable, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

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
}

export function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
    className,
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
            <View className={cn('flex flex-col gap-2', className)} {...props}>
                {children}
            </View>
        </TabsContext.Provider>
    );
}

interface TabsListProps extends ViewProps {
    children: React.ReactNode;
}

export function TabsList({ children, className, ...props }: TabsListProps) {
    return (
        <View
            className={cn(
                'flex-row items-center justify-center rounded-lg bg-muted p-1',
                className
            )}
            {...props}
        >
            {children}
        </View>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
    const { value: selectedValue, onValueChange } = useTabsContext();
    const isActive = selectedValue === value;

    return (
        <Pressable
            onPress={() => onValueChange(value)}
            className={cn(
                'flex-1 items-center justify-center rounded-md px-3 py-2',
                isActive ? 'bg-background shadow-sm' : 'bg-transparent',
                className
            )}
        >
            {typeof children === 'string' ? (
                <Text
                    className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}
                >
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
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
    const { value: selectedValue } = useTabsContext();

    if (value !== selectedValue) {
        return null;
    }

    return (
        <View className={cn('flex-1', className)} {...props}>
            {children}
        </View>
    );
}
