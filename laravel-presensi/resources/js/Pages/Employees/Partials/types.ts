export interface User {
    id: string;
    full_name: string;
    personal_email: string;
    personal_phone?: string;
    employee_id: string;
    role: string;
    status: string | boolean;
    join_date: string;
    position: string;
    department: { id: string; name: string } | null;
    site: { id: string; name: string } | null;
    company?: { id: string; name: string } | null;
    department_id?: string;
    site_id?: string;
    shift_id?: string;
    direct_manager_id?: string;
    employment_type?: string;
    direct_manager?: { id: string; full_name: string } | null;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    last_login?: string;
    face_biometric_count?: number;
    face_biometric?: {
        image_path: string;
        requires_re_registration: boolean;
    } | null;
    shift?: {
        id: string;
        name: string;
        start_time: string;
        end_time: string;
    } | null;
    work_schedules?: {
        day_of_week: number;
        is_working_day: boolean;
        clock_in: string | null;
        clock_out: string | null;
    }[];
}

export interface Invitation {
    id: string;
    email: string;
    token: string;
    role: string;
    position: string;
    effective_status: "pending" | "accepted" | "expired";
    expires_at: string;
    department: { name: string } | null;
    site: { name: string } | null;
    inviter: { full_name: string };
}

export interface Department {
    id: string;
    name: string;
}

export interface Site {
    id: string;
    name: string;
}

export type Role = "SUPERADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE";
