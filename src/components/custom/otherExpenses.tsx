import { OtherExpensesData } from "@/components/custom/reportDownloads";

interface Props {
  data: OtherExpensesData;
}

const formatILS = (amount: number) =>
  `₪${amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function OtherExpenses({ data }: Props) {
  const entries = Object.entries(data);

  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Expenses Without Documents</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1">Supplier</th>
            <th className="text-right py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([supplier, amount]) => (
            <tr key={supplier} className="border-b border-dashed">
              <td className="py-1">{supplier}</td>
              <td className="text-right py-1">{formatILS(amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="pt-2">Total</td>
            <td className="text-right pt-2">{formatILS(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}