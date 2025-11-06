export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    wallet_address?: string | null;
    role?: string | null;
    created_at?: string;
    updated_at?: string;
}
