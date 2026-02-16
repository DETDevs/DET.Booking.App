import {
    Home,
    Calendar,
    CalendarPlus,
    User,
    UsersRound,
    Settings,
    Package,
    CreditCard,
    BarChart3,
    type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Home,
    Calendar,
    CalendarPlus,
    User,
    UsersRound,
    Settings,
    Package,
    CreditCard,
    BarChart3,
};

export function resolveIcon(name: string): LucideIcon {
    return iconMap[name] ?? Home;
}
