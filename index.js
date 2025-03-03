import { registerRootComponent } from 'expo';
import App from './App'; // Importing from the root App.js
import { LogBox } from 'react-native';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Picker has been extracted from react-native',
  'VirtualizedLists should never be nested'
]);

// Enable more detailed error reporting
console.reportErrorsAsExceptions = false;

// Register the main component
registerRootComponent(App);