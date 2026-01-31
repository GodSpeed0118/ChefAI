import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { PantryItem } from '../../services/StorageService';
import { Colors } from '../../theme/Colors';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';
import { GlassCard } from '../common/GlassCard';
import { GradientButton } from '../common/GradientButton';

interface PantryModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (item: Partial<PantryItem>) => void;
    initialItem?: PantryItem | null;
}

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Pantry', 'Frozen', 'Other'];

export function PantryModal({ visible, onClose, onSave, initialItem }: PantryModalProps) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('pcs');
    const [category, setCategory] = useState('Pantry');
    const [expiryDays, setExpiryDays] = useState('7');

    useEffect(() => {
        if (initialItem) {
            setName(initialItem.name);
            setQuantity(initialItem.quantity.toString());
            setUnit(initialItem.unit);
            setCategory(initialItem.category);

            const diffTime = new Date(initialItem.expiryDate).getTime() - new Date().getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setExpiryDays(Math.max(0, diffDays).toString());
        } else {
            setName('');
            setQuantity('1');
            setUnit('pcs');
            setCategory('Pantry');
            setExpiryDays('7');
        }
    }, [initialItem, visible]);

    const handleSave = () => {
        if (!name.trim()) return;

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays || '0'));

        onSave({
            name: name.trim(),
            quantity: parseFloat(quantity) || 1,
            unit,
            category,
            expiryDate: expiryDate.toISOString(),
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill as ViewStyle} onPress={onClose} />
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.content}>
                    <GlassCard intensity={30} style={styles.modalCard as ViewStyle}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{initialItem ? 'Edit Item' : 'Add Ingredient'}</Text>
                            <Pressable onPress={onClose} style={styles.closeBtn as ViewStyle}>
                                <Ionicons name="close" size={24} color="white" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.formSection}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    style={styles.input as TextStyle}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. Avocado"
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.formSection, { flex: 1, marginRight: Spacing.md }] as ViewStyle[]}>
                                    <Text style={styles.label}>Quantity</Text>
                                    <TextInput
                                        style={styles.input as TextStyle}
                                        value={quantity}
                                        onChangeText={setQuantity}
                                        keyboardType="numeric"
                                        placeholder="1"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                    />
                                </View>
                                <View style={[styles.formSection, { flex: 1 }] as ViewStyle[]}>
                                    <Text style={styles.label}>Unit</Text>
                                    <TextInput
                                        style={styles.input as TextStyle}
                                        value={unit}
                                        onChangeText={setUnit}
                                        placeholder="pcs"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                    />
                                </View>
                            </View>

                            <View style={styles.formSection}>
                                <Text style={styles.label}>Category</Text>
                                <View style={styles.categoryContainer}>
                                    {CATEGORIES.map(cat => (
                                        <Pressable
                                            key={cat}
                                            onPress={() => setCategory(cat)}
                                            style={[
                                                styles.categoryChip,
                                                category === cat && styles.selectedCategory
                                            ] as ViewStyle[]}
                                        >
                                            <Text style={[
                                                styles.categoryText,
                                                category === cat && styles.selectedCategoryText
                                            ] as TextStyle[]}>{cat}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formSection}>
                                <Text style={styles.label}>Expires in (Days)</Text>
                                <TextInput
                                    style={styles.input as TextStyle}
                                    value={expiryDays}
                                    onChangeText={setExpiryDays}
                                    keyboardType="numeric"
                                    placeholder="7"
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                />
                            </View>

                            <View style={{ marginTop: Spacing.lg } as ViewStyle}>
                                <GradientButton
                                    title={initialItem ? "Update Pantry" : "Add to Pantry"}
                                    onPress={handleSave}
                                    icon={<Ionicons name={initialItem ? "save-outline" : "add"} size={20} color="white" />}
                                />
                            </View>
                        </ScrollView>
                    </GlassCard>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        padding: Spacing.lg,
    } as ViewStyle,
    content: {
        width: '100%',
        maxHeight: '80%',
    } as ViewStyle,
    modalCard: {
        padding: Spacing.xl,
    } as ViewStyle,
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    } as ViewStyle,
    title: {
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.black as any,
        color: 'white',
        flex: 1,
    } as TextStyle,
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    formSection: {
        marginBottom: Spacing.lg,
    } as ViewStyle,
    label: {
        fontSize: Typography.size.tiny,
        fontWeight: Typography.weight.bold as any,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    } as TextStyle,
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: Spacing.md,
        color: 'white',
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.medium as any,
    } as TextStyle,
    row: {
        flexDirection: 'row',
    } as ViewStyle,
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    } as ViewStyle,
    categoryChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    } as ViewStyle,
    selectedCategory: {
        backgroundColor: Colors.accent[500],
        borderColor: Colors.accent[600],
    } as ViewStyle,
    categoryText: {
        color: 'white',
        fontSize: Typography.size.sm,
        opacity: 0.6,
    } as TextStyle,
    selectedCategoryText: {
        opacity: 1,
        fontWeight: Typography.weight.bold as any,
    } as TextStyle,
});
