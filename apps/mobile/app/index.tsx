// apps/mobile/app/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useAuthStore } from './authStore';

// Dynamic API URL depending on if you run iOS Simulator or Android Emulator
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001/api' : 'http://localhost:5001/api';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setAuth = useAuthStore((state) => state.setAuth);
    const globalUser = useAuthStore((state) => state.user);

    const handleSubmit = async () => {
        if (!email || !password || (!isLogin && !name)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // Save user session globally
            await setAuth(data.user, data.token);
            Alert.alert('Success', `Welcome ${data.user.name}!`);
        } catch (error: any) {
            Alert.alert('Authentication Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    // If the user is logged in, show a simple dashboard placeholder for testing!
    if (globalUser) {
        return (
            <View className="flex-1 justify-center items-center bg-slate-50 p-6">
                <Text className="text-2xl font-bold text-slate-800">🎉 Authenticated!</Text>
                <Text className="text-slate-600 mt-2">Welcome back, {globalUser.name}</Text>
                <Text className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full mt-4 font-semibold">
                    Role: {globalUser.role}
                </Text>

                {globalUser.homeId ? (
                    <Text className="text-green-600 mt-4">Connected to Mess ID: {globalUser.homeId}</Text>
                ) : (
                    <View className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl w-full items-center">
                        <Text className="text-yellow-800 font-medium text-center">You haven't joined a Home yet.</Text>
                        <TouchableOpacity className="mt-4 bg-amber-500 py-3 px-6 rounded-lg w-full items-center">
                            <Text className="text-white font-bold">Create or Join a Home</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => useAuthStore.getState().logout()}
                    className="mt-12 bg-rose-500 py-3 px-6 rounded-lg"
                >
                    <Text className="text-white font-bold">Log Out</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center bg-slate-900 p-6">
            <View className="bg-white p-8 rounded-3xl shadow-xl">
                <Text className="text-3xl font-black text-slate-800 mb-2 text-center">MealMate</Text>
                <Text className="text-slate-500 text-center mb-8">
                    {isLogin ? 'Log in to manage your bachelor mess' : 'Create an account for your mess'}
                </Text>

                {!isLogin && (
                    <View className="mb-4">
                        <Text className="text-slate-700 font-semibold mb-2">Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="John Doe"
                            className="border border-slate-200 rounded-xl p-3 text-slate-800 bg-slate-50"
                        />
                    </View>
                )}

                <View className="mb-4">
                    <Text className="text-slate-700 font-semibold mb-2">Email Address</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="yourname@email.com"
                        className="border border-slate-200 rounded-xl p-3 text-slate-800 bg-slate-50"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-slate-700 font-semibold mb-2">Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="••••••••"
                        className="border border-slate-200 rounded-xl p-3 text-slate-800 bg-slate-50"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="bg-blue-600 rounded-xl p-4 flex-row justify-center items-center shadow-lg shadow-blue-500/20"
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-center text-lg">
                            {isLogin ? 'Log In' : 'Sign Up'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsLogin(!isLogin)}
                    className="mt-6"
                >
                    <Text className="text-blue-600 font-medium text-center">
                        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}