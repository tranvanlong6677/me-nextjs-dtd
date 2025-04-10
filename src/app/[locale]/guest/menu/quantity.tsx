import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex gap-1 ">
      <Button
        className="h-6 w-6 p-0"
        disabled={value === 0}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="w-3 h-3" />
      </Button>
      <Input
        type="text"
        className="h-6 p-1 w-8 text-center"
        defaultValue={0}
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => {
          let value = e.target.value;
          const numberValue = Number(value);
          if (isNaN(numberValue)) {
            return;
          }

          onChange(numberValue);
        }}
      />
      <Button
        className="h-6 w-6 p-0"
        onClick={() => onChange(value + 1)}
        disabled={value === 9}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}
