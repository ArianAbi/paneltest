"use client";

import { allUsersContext } from "@/app/components/AdminUsersListContext";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import UserProfile from "@/app/components/UserProfile";
import { Database } from "@/database.types";
import { createClient } from "@/util/supabase/SupabaseClient";
import { useContext, useEffect, useState } from "react";

interface ProjectData {
  project_data: Database["public"]["Tables"]["project"]["Row"] & {
    project_members:
      | Database["public"]["Tables"]["project_members"]["Row"][]
      | null;
  };
}

export default function ProjectCard({ project_data }: ProjectData) {
  const supabase = createClient();

  const allUsers = useContext(allUsersContext);

  const [leader, setLeader] = useState<
    null | Database["public"]["Tables"]["users"]["Row"]
  >(null);

  const [members, setMembers] = useState<
    null | Database["public"]["Tables"]["users"]["Row"][]
  >(null);

  const [leaderLoading, setLeaderLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);

  async function getLeader() {
    const { data: _leader } = await supabase
      .from("users")
      .select("*")
      .eq("id", project_data.leader)
      .single();

    setLeaderLoading(false);
    setLeader(_leader);
  }

  async function getMembers() {
    if (!project_data.project_members || !allUsers) {
      setMembersLoading(false);
      return;
    }

    const _members = [] as Database["public"]["Tables"]["users"]["Row"][];

    project_data.project_members.forEach((member) => {
      const userIndex = allUsers.findIndex(
        (user) => user.id === member.user_id
      );
      console.log(userIndex);

      if (userIndex != -1) {
        _members.push(allUsers[userIndex]);
      }
    });

    setMembersLoading(false);
    setMembers(_members);
  }

  useEffect(() => {
    if (allUsers) {
      getMembers();
    }
  }, [allUsers]);

  useEffect(() => {
    getLeader();
  }, []);

  return (
    <>
      <Card className="w-full flex flex-col">
        <CardHeader>
          <CardTitle>{project_data.title}</CardTitle>
          <CardDescription>{project_data.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex gap-2 mt-auto">
            <span>Leader : </span>
            {!leader && leaderLoading && <Skeleton className="h-6 w-24" />}
            {leader && <UserProfile user={leader} />}
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <span>Members : </span>
            {!members &&
              membersLoading &&
              Array(3)
                .fill(null)
                .map((_k, _i) => <Skeleton key={_i} className="h-6 w-24" />)}

            {members &&
              members.map((member) => {
                return <UserProfile key={member.id} user={member} />;
              })}

            {!membersLoading && members?.length === 0 && (
              <p className="my-0">no members assigned</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button variant={"destructive"}>Delete</Button>
        </CardFooter>
      </Card>
    </>
  );
}
