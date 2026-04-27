import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { useAppState } from '../context/AppContext';
import { SHOP_ITEMS } from '../constants/exercises';

export default function ShopScreen() {
  const { state, dispatch } = useAppState();

  const handleBuy = (item) => {
    if (state.discipline < item.cost) {
      Alert.alert('Not enough points', `You need ${item.cost} discipline points for this item.`);
      return;
    }

    Alert.alert(
      `Buy ${item.name}?`,
      `This will cost ${item.cost} discipline points.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            dispatch({ type: 'BUY_ITEM', payload: { id: item.id, cost: item.cost } });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{`Shop \uD83D\uDED2`}</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.currRow}>
          <View style={styles.currCard}>
            <Text style={styles.currVal}>{`\uD83D\uDC8E ${state.discipline}`}</Text>
            <Text style={styles.currLbl}>Discipline Points</Text>
          </View>
          <View style={styles.currCard}>
            <Text style={styles.currVal}>{`\u2B50 ${state.xp}`}</Text>
            <Text style={styles.currLbl}>Total XP</Text>
          </View>
        </View>

        {SHOP_ITEMS.map((cat, ci) => (
          <View key={ci}>
            <Text style={styles.sectionLabel}>
              {cat.category.toUpperCase()}
            </Text>
            <View style={styles.shopItems}>
              {cat.items.map((item, ii) => {
                const canAfford = state.discipline >= item.cost;
                return (
                  <View key={ii} style={styles.shopItem}>
                    <Text style={styles.shopItemIcon}>{item.icon}</Text>
                    <View style={styles.shopItemInfo}>
                      <Text style={styles.shopItemName}>{item.name}</Text>
                      <Text style={styles.shopItemDesc}>{item.desc}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.shopItemCost,
                        !canAfford && styles.shopItemCostDisabled,
                      ]}
                      onPress={() => handleBuy(item)}
                      disabled={!canAfford}
                    >
                      <Text
                        style={[
                          styles.costText,
                          !canAfford && styles.costTextDisabled,
                        ]}
                      >
                        {`\uD83D\uDC8E${item.cost}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.grayLight },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.grayMed,
  },
  headerTitle: { fontSize: 21, fontWeight: '900', color: Colors.text },
  body: { flex: 1 },
  bodyContent: { padding: 14, paddingBottom: 100 },
  currRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  currCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    shadowColor: Colors.grayMed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  currVal: { fontSize: 22, fontWeight: '900', color: Colors.text },
  currLbl: { fontSize: 11, color: Colors.text2, fontWeight: '700' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 6,
  },
  shopItems: { gap: 10 },
  shopItem: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    shadowColor: Colors.grayMed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  shopItemIcon: { fontSize: 28, width: 44, textAlign: 'center' },
  shopItemInfo: { flex: 1 },
  shopItemName: { fontSize: 14, fontWeight: '800', color: Colors.text },
  shopItemDesc: { fontSize: 12, color: Colors.text2, fontWeight: '600', marginTop: 2 },
  shopItemCost: {
    backgroundColor: Colors.purpleBg,
    borderRadius: 99,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  shopItemCostDisabled: { opacity: 0.4 },
  costText: { fontSize: 13, fontWeight: '900', color: Colors.purpleDark },
  costTextDisabled: { color: Colors.gray },
});
