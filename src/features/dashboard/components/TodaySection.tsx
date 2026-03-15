import { useTenant } from "@/entities/tenant/TenantContext";
import { StaffLaneView } from "./StaffLaneView";
import { TableLaneView } from "./TableLaneView";

export function TodaySection() {
  const tenant = useTenant();
  return tenant.type === "restaurant" ? <TableLaneView /> : <StaffLaneView />;
}
