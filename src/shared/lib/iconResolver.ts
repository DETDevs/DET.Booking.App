import {
    Home,
    Calendar,
    CalendarCheck,
    CalendarPlus,
    User,
    Users,
    UsersRound,
    Settings,
    Package,
    CreditCard,
    BarChart3,
    Clock,
    Stethoscope,
    Building,
    Scissors,
    LayoutGrid,
    UtensilsCrossed,
    type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Home,
    Calendar,
    CalendarCheck,
    CalendarPlus,
    User,
    Users,
    UsersRound,
    Settings,
    Package,
    CreditCard,
    BarChart3,
    Clock,
    Stethoscope,
    Building,
    Scissors,
    LayoutGrid,
    UtensilsCrossed,
};

export function resolveIcon(name: string): LucideIcon {
    return iconMap[name] ?? Home;
}
