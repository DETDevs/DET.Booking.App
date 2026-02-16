export interface TenantConfig {
    id: string;
    name: string;
    type: "clinic" | "restaurant" | "hotel" | "barbershop" | "generic";
    schemaDir: string;
    branding?: TenantBranding;
    features: Record<string, FeatureConfig>;
    navigation: NavigationItem[];
}

export interface TenantBranding {
    logo?: string;
    primaryColor?: string;
    accentColor?: string;
    theme?: "light" | "dark";
}

export interface FeatureConfig {
    enabled: boolean;
    label?: string;
    path?: string;
}

export interface NavigationItem {
    featureKey: string;
    icon: string;
    path: string;
}
