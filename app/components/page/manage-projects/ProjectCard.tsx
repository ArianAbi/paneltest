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
import { getUsersFromIdsAction } from "@/util/actions/Admin/ManageProjectsActions";
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

  async function fetchMembers() {
    if (!project_data.project_members) {
      return;
    }

    const ids = project_data.project_members.map((memb) => memb.user_id);

    try {
      if (ids) {
        const members = await getUsersFromIdsAction(ids as string[]);

        if (members) {
          setMembers(members as Database["public"]["Tables"]["users"]["Row"][]);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setMembersLoading(false);
    }
  }

  useEffect(() => {
    getLeader();
    fetchMembers();
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
            {/* fallback for when project members are loading */}
            {!members &&
              membersLoading &&
              Array(3)
                .fill(null)
                .map((_k, _i) => <Skeleton key={_i} className="h-6 w-24" />)}

            {/* fallback for when project has no members */}
            {project_data.project_members &&
              project_data.project_members.length === 0 && (
                <p className="my-0 italic">No Members</p>
              )}

            {/* members */}
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
