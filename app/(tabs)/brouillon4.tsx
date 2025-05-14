"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native"

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function AdaptiveHeightExample() {
  const [showSection1, setShowSection1] = useState(true)
  const [showSection2, setShowSection2] = useState(true)
  const [showSection3, setShowSection3] = useState(true)

  const toggleSection = (section:any) => {
    // Configure animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    // Toggle the appropriate section
    if (section === 1) setShowSection1(!showSection1)
    if (section === 2) setShowSection2(!showSection2)
    if (section === 3) setShowSection3(!showSection3)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adaptive Height Example</Text>
      <Text style={styles.description}>
        The container height adjusts automatically when sections are shown or hidden
      </Text>

      {/* Main content container - height adapts automatically */}
      <View style={styles.contentContainer}>
        {/* Section 1 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Section 1</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={() => toggleSection(1)}>
            <Text style={styles.toggleButtonText}>{showSection1 ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        {showSection1 && (
          <View style={styles.sectionContent}>
            <Text>This is the content for section 1.</Text>
            <Text>It can contain any components.</Text>
            <Text>The page height will adjust when this is hidden.</Text>
          </View>
        )}

        {/* Section 2 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Section 2</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={() => toggleSection(2)}>
            <Text style={styles.toggleButtonText}>{showSection2 ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        {showSection2 && (
          <View style={[styles.sectionContent, { height: 120 }]}>
            <Text>This section has a taller content area.</Text>
            <Text>When hidden, the page will shrink significantly.</Text>
          </View>
        )}

        {/* Section 3 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Section 3</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={() => toggleSection(3)}>
            <Text style={styles.toggleButtonText}>{showSection3 ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        {showSection3 && (
          <View style={styles.sectionContent}>
            <Text>This is the content for section 3.</Text>
            <Text>Try hiding all sections to see the minimum height.</Text>
          </View>
        )}
      </View>

      <Text style={styles.footer}>The page height has adjusted automatically based on visible content</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  contentContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#f9f9f9",
    // No fixed height - will adapt to content
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  toggleButton: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "500",
  },
  sectionContent: {
    padding: 12,
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 4,
  },
  footer: {
    marginTop: 16,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
})
