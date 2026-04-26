export interface User {
    id: string;
    full_name: string;
    personal_email: string;
    personal_phone: string;
    role: 'SUPERADMIN' | 'OWNER' | 'MANAGER' | 'EMPLOYEE';
    profile_photo?: string;
    employee_id?: string;
    position?: string;
    email_verified_at?: string;
    company_id?: string;
    department_id?: string;
    site_id?: string;
    shift_id?: string;
    direct_manager_id?: string;
    status: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    last_login?: string;
    company?: {
        company_name: string;
    };
    department?: {
        id: string;
        name: string;
    };
    site?: {
        id: string;
        name: string;
    };
}

export interface Attendance {
    id: string;
    user_id: string;
    company_id: string;
    site_id: string;
    timestamp: string;
    type: 'CLOCK_IN' | 'CLOCK_OUT';
    status: string;
    is_late: boolean;
    confidence: number;
    latitude: number;
    longitude: number;
    notes?: string;
    user?: User;
    site?: { name: string };
    location?: AttendanceLocation;
    biometric?: AttendanceBiometric;
    network?: AttendanceNetwork;
}

export interface AttendanceLocation {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    source?: string;
    status_geofence?: string;
    geofence_id?: string;
    distance_from_office?: number;
    address_captured?: string;
    speed?: number;
    bearing?: number;
    location_provider?: string;
    satellites_count?: number;
    is_mock_location: boolean;
    wifi_bssid_list?: string[];
}

export interface AttendanceBiometric {
    face_embedding?: number[];
    similarity_score?: number;
    match_result?: string;
    face_quality_score?: number;
    mask_detected: boolean;
    liveness_score?: number;
    spoof_flag?: string;
    attack_type?: string;
    evidence_path?: string;
}

export interface AttendanceNetwork {
    ip_address?: string;
    network_type?: string;
    vpn_detected: boolean;
    proxy_detected: boolean;
    wifi_ssid?: string;
    wifi_bssid?: string;
    signal_strength?: number;
    ip_country?: string;
    suspicious_network: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success: string | null;
        error: string | null;
        warning: string | null;
        info: string | null;
        message: string | null;
        status: string | null;
    };
};
