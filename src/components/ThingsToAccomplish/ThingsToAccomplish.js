import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import COLORS from '../../colors';
import useToDo from '../../hooks/useToDo';
import '../../../src/styles/components/ThingsToAccomplish.css';

/**
 * Things to Accomplish Component
 * 
 * A to-do list feature that allows users to add tasks they want to accomplish.
 * Tasks from this list can be clicked to fill in the TaskInput form for scheduling.
 * 
 * @param {Object} props
 * @param {Function} props.onTaskSelect - Function to handle when a task is selected for scheduling
 */
const ThingsToAccomplish = ({ onTaskSelect }) => {
  const { toDoItems, addToDoItem, toggleToDoItem, removeToDoItem, clearCompletedItems } = useToDo();
  const [newItemTitle, setNewItemTitle] = useState('');
  
  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      addToDoItem(newItemTitle);
      setNewItemTitle(''); // Clear input after adding
    }
  };
  
  const handleKeyPress = (e) => {
    // Add to-do item on Enter key press (for web)
    if (Platform.OS === 'web' && e.key === 'Enter') {
      handleAddItem();
    }
  };
  
  const handleTaskSelect = (item) => {
    // Call the parent component's handler with the selected task title
    if (onTaskSelect) {
      onTaskSelect(item.title);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Things to Accomplish</Text>
      
      {/* Add new to-do item input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItemTitle}
          onChangeText={setNewItemTitle}
          placeholder="Add a task to accomplish..."
          placeholderTextColor={COLORS.secondaryDark}
          onKeyPress={handleKeyPress}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddItem}
          disabled={!newItemTitle.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      {/* To-Do List */}
      {toDoItems.length > 0 ? (
        <View style={styles.listContainer}>
          {Platform.OS === 'web' ? (
            /* Web version - Use div for better scrolling on web */
            <div className="todo-list">
              {toDoItems.map(item => (
                <div 
                  key={item.id} 
                  className={`todo-item ${item.completed ? 'completed' : ''}`}
                  onClick={() => handleTaskSelect(item)}
                >
                  <div className="todo-content">
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => toggleToDoItem(item.id)}
                    >
                      <View style={[
                        styles.checkboxInner,
                        item.completed && styles.checkboxChecked
                      ]} />
                    </TouchableOpacity>
                    <Text 
                      style={[
                        styles.todoText, 
                        item.completed && styles.completedText
                      ]}
                    >
                      {item.title}
                    </Text>
                  </div>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeToDoItem(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </div>
              ))}
            </div>
          ) : (
            /* Mobile version - Use FlatList for better performance on mobile */
            <FlatList
              data={toDoItems}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.todoItem}
                  onPress={() => handleTaskSelect(item)}
                >
                  <View style={styles.todoContent}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => toggleToDoItem(item.id)}
                    >
                      <View style={[
                        styles.checkboxInner,
                        item.completed && styles.checkboxChecked
                      ]} />
                    </TouchableOpacity>
                    <Text 
                      style={[
                        styles.todoText, 
                        item.completed && styles.completedText
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeToDoItem(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      ) : (
        /* Empty state */
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Your to-do list is empty. Add tasks above to get started.
          </Text>
        </View>
      )}
      
      {/* Actions for the to-do list */}
      {toDoItems.length > 0 && (
        <View style={styles.actionsContainer}>
          <Text style={styles.itemCount}>
            {toDoItems.filter(item => !item.completed).length} items left
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearCompletedItems}
          >
            <Text style={styles.clearButtonText}>Clear completed</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Helper Text */}
      {toDoItems.length > 0 && (
        <Text style={styles.helperText}>
          Click on any task to schedule it
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary, // Same as other components (blue)
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.black,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: COLORS.white,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    maxHeight: 300, // Limit height and add scrolling
    marginBottom: 10,
  },
  // The following styles apply to both web and mobile
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondaryLight,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  todoText: {
    fontSize: 16,
    color: COLORS.black,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.secondaryDark,
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 22,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 8,
    marginTop: 10,
  },
  emptyStateText: {
    color: COLORS.secondaryDark,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondaryLight,
  },
  itemCount: {
    fontSize: 14,
    color: COLORS.secondaryDark,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.secondaryDark,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  }
});

export default ThingsToAccomplish;