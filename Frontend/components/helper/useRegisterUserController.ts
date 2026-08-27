import { useState } from 'react';
import { Alert } from 'react-native';
import { useHelperRegisterUser } from '@/lib/hooks';

export const ALL_ROLES = [
    { value: 'student', label: 'Student', icon: 'school-outline', color: '#6366f1' },
    { value: 'parent', label: 'Parent', icon: 'people-outline', color: '#f59e0b' },
    { value: 'warden', label: 'Warden', icon: 'shield-outline', color: '#10b981' },
    { value: 'guard', label: 'Guard', icon: 'shield-checkmark-outline', color: '#3b82f6' },
    { value: 'mess_staff', label: 'Mess Staff', icon: 'restaurant-outline', color: '#ef4444' },
    { value: 'helper', label: 'Helper', icon: 'person-add-outline', color: '#8b5cf6' },
    { value: 'admin', label: 'Admin', icon: 'settings-outline', color: '#64748b' },
] as const;

export type RoleValue = typeof ALL_ROLES[number]['value'];

export interface SuccessCardData {
    name: string;
    email: string;
    role: string;
    rollNo: string;
    room: string;
    hostel: string;
}

export function useRegisterUserController() {
    const [role, setRole] = useState<RoleValue>('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rollNo, setRollNo] = useState('');
    const [room, setRoom] = useState('');
    const [hostel, setHostel] = useState('');
    const [phone, setPhone] = useState('');
    const [year, setYear] = useState<number>(1);
    const [parentEmail, setParentEmail] = useState('');
    const [successCard, setSuccessCard] = useState<SuccessCardData | null>(null);

    const mutation = useHelperRegisterUser();
    const isStudent = role === 'student';
    const isParent = role === 'parent';
    const selectedRole = ALL_ROLES.find((r) => r.value === role)!;

    const reset = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRollNo('');
        setRoom('');
        setHostel('');
        setPhone('');
        setYear(1);
        setParentEmail('');
        setSuccessCard(null);
    };

    const handleSubmit = () => {
        if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        if (!isParent && (!rollNo.trim() || !room.trim() || !hostel.trim())) {
            Alert.alert('Missing Fields', 'Please fill in Roll No, Room, and Hostel.');
            return;
        }
        if (isStudent && (!year || year < 1 || year > 4)) {
            Alert.alert('Missing Fields', 'Please select academic year for student.');
            return;
        }

        mutation.mutate(
            {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                rollNo: isParent ? 'PARENT' : rollNo.trim(),
                room: isParent ? 'N/A' : room.trim(),
                hostel: isParent ? 'N/A' : hostel.trim(),
                phone: phone.trim(),
                role,
                ...(isStudent ? { year } : {}),
                ...(parentEmail.trim() ? { parentEmail: parentEmail.trim().toLowerCase() } : {}),
            },
            {
                onSuccess: (data) => {
                    setSuccessCard({
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        rollNo: data.rollNo,
                        room: data.room,
                        hostel: data.hostel,
                    });
                },
                onError: (error: any) => {
                    const msg = error?.response?.data?.message || error?.message || 'Registration failed.';
                    Alert.alert('Error', msg);
                },
            }
        );
    };

    return {
        role,
        setRole,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        rollNo,
        setRollNo,
        room,
        setRoom,
        hostel,
        setHostel,
        phone,
        setPhone,
        year,
        setYear,
        parentEmail,
        setParentEmail,
        successCard,
        mutation,
        isStudent,
        isParent,
        selectedRole,
        reset,
        handleSubmit,
    };
}
