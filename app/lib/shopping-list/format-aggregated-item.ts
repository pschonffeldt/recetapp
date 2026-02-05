import { UNIT_LABELS } from "@/app/lib/types/definitions";
import type { AggregatedItem } from "./aggregate-ingredients";

export function formatAggregatedItem(item: AggregatedItem): string {
  const { name, unit, quantity } = item;

  if (quantity == null) return name;

  const unitLabel = unit ? (UNIT_LABELS[unit] ?? unit) : null;

  if (!unitLabel) return `${quantity} ${name}`;

  return `${quantity} ${unitLabel} ${name}`;
}
