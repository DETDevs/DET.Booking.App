export interface TenantConfig {
    id: string;
    name: string;
    type: "clinic" | "restaurant" | "hotel" | "generic";
    logo?: string;
    primaryColor?: string;
    theme?: "light" | "dark";
    features: {
        dashboard: FeatureConfig;
        bookings: BookingFeatureConfig;
        patients: FeatureConfig; // Replaces CustomerPage
        staff: FeatureConfig;   // Replaces UsersPage
        inventory?: FeatureConfig;
        billing?: FeatureConfig;
        settings: FeatureConfig;
    };
}

export interface FeatureConfig {
    enabled: boolean;
    label?: string; // Override default label (e.g. "Doctores" instead of "Users")
    path?: string;  // Override default path
}

export interface BookingFeatureConfig extends FeatureConfig {
    allowGuestBooking?: boolean;
    requiresApproval?: boolean;
    calendarView?: "day" | "week" | "month";
}
