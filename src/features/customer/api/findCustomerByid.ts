import { customerData, type Customer } from "../data/customerdata";

export async function findCustomerById(
  idOrEmail: string
): Promise<Customer | null> {
  const id = idOrEmail.trim().toLowerCase();
  const found =
    customerData.find(
      (c) => c.id.toLowerCase() === id || c.email.toLowerCase() === id
    ) ?? null;

  await new Promise((r) => setTimeout(r, 400));
  return found;
}
