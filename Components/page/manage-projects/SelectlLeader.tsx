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
import { allUsersContext } from "@/components/AdminUsersListContext";

interface SelectLeader {
  value: string;
  setValue: any;
}

export default function SelectLeader({ value, setValue }: SelectLeader) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const usersCTX = React.useContext(allUsersContext);
  const [users, setUsers] = React.useState<
    undefined | Database["public"]["Tables"]["users"]["Row"][]
  >(undefined);

  React.useEffect(() => {
    if (usersCTX) {
      setLoading(false);
      setUsers(usersCTX);
    }
  }, [usersCTX]);

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
            ? users
              ? users.find((user) => user.id === value)?.email
              : value
            : "Select Leader..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] sm:w-[300px] lg:w-[450px] p-0">
        <Command>
          <CommandInput placeholder="Search user by email..." />
          <CommandList>
            {loading && (
              <div className="w-full text-center py-6 animate-pulse">
                Loading...
              </div>
            )}
            {!loading && <CommandEmpty>No Users found.</CommandEmpty>}
            <CommandGroup>
              {!loading &&
                users &&
                users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === user.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{user.email}</span>
                    <span className="ml-auto">
                      {user.first_name + " " + user.last_name}
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
