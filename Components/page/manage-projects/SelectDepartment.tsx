"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import { supabaseAdminClient } from "@/util/supabase/SupabaseClientAdmin";

interface SelectDepartment {
  value: string;
  setValue: any;
}

export default function SelectDepartment({
  value,
  setValue,
}: SelectDepartment) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [departments, setDepartments] = React.useState<
    undefined | Database["public"]["Tables"]["department"]["Row"][]
  >(undefined);

  const supabaseAdmin = supabaseAdminClient;

  async function getDepartments() {
    try {
      const { data: _department, error: _department_error } =
        await supabaseAdmin.from("department").select("*");

      if (_department_error) {
        throw _department_error;
      }

      setDepartments(_department);
    } catch (err: any) {
      throw err.message;
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getDepartments();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? departments
              ? departments.find(({ id }) => id === value)?.name
              : value
            : "Select Department..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] sm:w-[300px] lg:w-[450px] p-0">
        <Command>
          <CommandInput placeholder="Search Department..." />
          <CommandList>
            {loading && (
              <div className="w-full text-center py-6 animate-pulse">
                Loading...
              </div>
            )}
            {!loading && <CommandEmpty>No Departments found.</CommandEmpty>}
            <CommandGroup>
              {!loading &&
                departments &&
                departments.map(({ id, name }) => (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
