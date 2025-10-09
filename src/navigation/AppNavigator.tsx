import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

// Import screens
import { MainMenu } from '../screens/MainMenu';
import { GameSetup } from '../screens/GameSetup';
import { GameBoard } from '../screens/GameBoard';
import { Settings } from '../screens/Settings';
import { AISettings } from '../screens/AISettings';
import { RuleBook } from '../screens/RuleBook';
import { Tutorials } from '../screens/Tutorials';
import { Profile } from '../screens/Profile';
import { OnlineLobby } from '../screens/OnlineLobby';
import { Matchmaking } from '../screens/Matchmaking';
import { Forum } from '../screens/Forum';
import { Chat } from '../screens/Chat';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainMenu"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainMenu"
          component={MainMenu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameSetup"
          component={GameSetup}
          options={{ title: 'Game Setup' }}
        />
        <Stack.Screen
          name="GameBoard"
          component={GameBoard}
          options={{ title: 'Fanorona', headerLeft: () => null }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen
          name="AISettings"
          component={AISettings}
          options={{ title: 'AI Opponent' }}
        />
        <Stack.Screen
          name="RuleBook"
          component={RuleBook}
          options={{ title: 'Rules' }}
        />
        <Stack.Screen
          name="Tutorials"
          component={Tutorials}
          options={{ title: 'Learn' }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="OnlineLobby"
          component={OnlineLobby}
          options={{ title: 'Online Play' }}
        />
        <Stack.Screen
          name="Matchmaking"
          component={Matchmaking}
          options={{ title: 'Finding Match...' }}
        />
        <Stack.Screen
          name="Forum"
          component={Forum}
          options={{ title: 'Community' }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ title: 'Chat' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};