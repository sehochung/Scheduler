import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../colors';

const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { id: 'work', label: 'Work Mode', color: COLORS.primary, icon: '💼' },
    { id: 'leisure', label: 'Leisure', color: COLORS.success, icon: '🎮' },
    { id: 'grind', label: 'Grind Mode', color: COLORS.secondaryDark, icon: '🔥' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Categories</Text>
      
      <View style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: category.color },
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryLabel}>{category.label}</Text>
            
            {selectedCategory === category.id && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: COLORS.secondaryDark,
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryLabel: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    height: 3,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
});

export default CategorySelector;