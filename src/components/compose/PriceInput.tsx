"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { DollarSign } from "lucide-react";

interface PriceInputProps {
  field: {
    name: string;
    value: number; // value in cents
    onChange: (value: number) => void;
  };
  disabled?: boolean;
  className?: string;
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ field, disabled = false }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [display, setDisplay] = useState("");

    // update display whenever value changes externally
    useEffect(() => {
      const cents = field.value ?? 0;
      const dollars = Math.floor(cents / 100);
      const remainder = cents % 100;
      setDisplay(`${dollars}.${remainder.toString().padStart(2, "0")}`);
    }, [field.value]);

    const updateValue = (newCents: number) => {
      field.onChange(newCents);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (["Tab", "Enter", "Escape"].includes(e.key)) return;
      e.preventDefault();

      const currentCents = field.value ?? 0;

      if (e.key === "Backspace") {
        const newCents = Math.floor(currentCents / 10);
        updateValue(newCents);
        return;
      }

      if (/^\d$/.test(e.key)) {
        const digit = parseInt(e.key);
        const newCents = currentCents * 10 + digit;
        updateValue(newCents);
        return;
      }
    };

    useEffect(() => {
      const input = inputRef.current;
      if (input) {
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    }, [display]);

    return (
      <div className="flex items-center h-fit">
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            value={display}
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            className="!text-muted-foreground"
          />
          <InputGroupAddon>
            <DollarSign />
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  }
);

PriceInput.displayName = "PriceInput";
