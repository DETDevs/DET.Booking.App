export const currency = (n: number | undefined) =>
  n != null
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : "--";
