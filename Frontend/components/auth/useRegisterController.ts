import { useState } from 'react';
import { router } from 'expo-router';
import { useRegister } from '@/lib/hooks';
import { useAuth } from '@/lib/contexts/auth';
import { UserRole } from '@/lib/types';

/**
 * Controller hook for the Register account screen.
 * Handles form field state, validation logic, role variations,
 * and user session authentication on successful creation.
 */
export function useRegisterController() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [room, setRoom] = useState('');
    const [hostel, setHostel] = useState('');
    const [phone, setPhone] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [role, setRole] = useState<UserRole>('student');
    const [year, setYear] = useState<number>(1);

    const registerMutation = useRegister();
    const { signIn } = useAuth();

    const isStudent = role === 'student';
    const isParent = role === 'parent';

    const handleRegister = () => {
        if (!name || !email || !password || !phone) {
            return;
        }
        if (!isParent && (!rollNo || !room || !hostel)) {
            return;
        }
        if (isStudent && (!year || year < 1 || year > 4)) {
            return;
        }

        registerMutation.mutate(
            {
                name,
                email,
                password,
                rollNo: isParent ? 'PARENT' : rollNo,
                room: isParent ? 'N/A' : room,
                hostel: isParent ? 'N/A' : hostel,
                phone,
                role,
                ...(isStudent ? { year } : {}),
                parentEmail: !isParent && parentEmail ? parentEmail : undefined,
            },
            {
                onSuccess: (data) => {
                    if (data?.token) {
                        signIn(data.token);
                    }
                    router.replace('/');
                },
                onError: (error: any) => {
                    console.error('Registration failed:', error);
                },
            }
        );
    };

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        rollNo,
        setRollNo,
        room,
        setRoom,
        hostel,
        setHostel,
        phone,
        setPhone,
        parentEmail,
        setParentEmail,
        role,
        setRole,
        year,
        setYear,
        isStudent,
        isParent,
        registerMutation,
        handleRegister,
    };
}
