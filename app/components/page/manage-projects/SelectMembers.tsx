"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Database } from "@/database.types";
import UserProfile from "@/app/components/UserProfile";
import { allUsersContext } from "@/app/components/AdminUsersListContext";

interface SelectLeader {
  value: string[];
  setValue: any;
}

export default function SelectMembers({ value, setValue }: SelectLeader) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [users, setUsers] = React.useState<
    undefined | Database["public"]["Tables"]["users"]["Row"][]
  >(undefined);

  const usersCTX = React.useContext(allUsersContext);

  React.useEffect(() => {
    if (usersCTX) {
      setLoading(false);
      setUsers(usersCTX);
    }
  }, [usersCTX]);

  function addUser(user_id: string) {
    const newValue = [...value];

    const currentIdIndex = newValue.findIndex((id) => id === user_id);

    if (currentIdIndex === -1) {
      newValue.push(user_id);
      setValue(newValue);
    }
  }

  function removeUser(user_id: string) {
    const newValue = [...value];

    const currentIdIndex = newValue.findIndex((id) => id === user_id);

    if (currentIdIndex !== -1) {
      newValue.splice(currentIdIndex, 1);
      setValue(newValue);
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Add Members...
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
                      value={user.email ? user.email : user.id}
                    >
                      <UserProfile user={user} />

                      <div className="ml-auto flex items-center gap-2">
                        <span>{user.email}</span>
                        {/*display add button if this user is not on the list */}
                        {!value.find((id) => id === user.id) && (
                          <Button
                            onClick={() => addUser(user.id)}
                            className="ml-auto"
                          >
                            Add
                          </Button>
                        )}
                        {/*display remove button if this id is on the list*/}
                        {value.find((id) => id === user.id) && (
                          <Button
                            onClick={() => removeUser(user.id)}
                            variant={"destructive"}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Added Members List */}
      <div>
        {/* <h4>Members Added :</h4> */}

        {!users && <p>Could not fetch users</p>}

        <div className="flex flex-wrap gap-2 items-start justify-start mb-3 mt-4 mx-4">
          {users &&
            value.map((id, _i) => {
              const currentUser = users.find((user) => user.id === id);
              if (currentUser) {
                return <UserProfile key={_i} user={currentUser} />;
              }
            })}
        </div>
      </div>
    </>
  );
}
