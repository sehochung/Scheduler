import { useState, useEffect } from 'react';

/**
 * Custom hook to manage a to-do list
 * Stores to-do items in localStorage for persistence
 * 
 * @returns {Object} Methods and state for managing to-do items
 */
const useToDo = () => {
  // State to store to-do items
  const [toDoItems, setToDoItems] = useState([]);
  
  // Load saved to-do items from localStorage on component mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('toDoItems');
      if (savedItems) {
        setToDoItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading to-do items from localStorage:', error);
    }
  }, []);
  
  // Save to-do items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('toDoItems', JSON.stringify(toDoItems));
    } catch (error) {
      console.error('Error saving to-do items to localStorage:', error);
    }
  }, [toDoItems]);
  
  /**
   * Add a new to-do item
   * @param {string} title - The title of the to-do item
   */
  const addToDoItem = (title) => {
    if (!title.trim()) return; // Don't add empty items
    
    const newItem = {
      id: Date.now().toString(), // Unique ID based on timestamp
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setToDoItems([...toDoItems, newItem]);
  };
  
  /**
   * Toggle the completed status of a to-do item
   * @param {string} id - The ID of the to-do item to toggle
   */
  const toggleToDoItem = (id) => {
    setToDoItems(
      toDoItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  /**
   * Remove a to-do item
   * @param {string} id - The ID of the to-do item to remove
   */
  const removeToDoItem = (id) => {
    setToDoItems(toDoItems.filter(item => item.id !== id));
  };
  
  /**
   * Clear all completed to-do items
   */
  const clearCompletedItems = () => {
    setToDoItems(toDoItems.filter(item => !item.completed));
  };
  
  return {
    toDoItems,
    addToDoItem,
    toggleToDoItem,
    removeToDoItem,
    clearCompletedItems
  };
};

export default useToDo;