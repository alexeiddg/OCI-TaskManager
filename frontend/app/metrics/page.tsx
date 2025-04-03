"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/model/User";
import { Sprint } from "@/model/Sprint";
import { SprintService } from "@/services/sprintService";

export default function MetricsPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [sprintData, setSprintData] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, []);

  // Fetch sprint metrics once user data is available
  useEffect(() => {
    if (user) {
      const fetchMetrics = async () => {
        setLoading(true);
        try {
          const sprintData = await SprintService.getSprintById(1);
          console.log("SprintData: ", sprintData);

          if (sprintData !== null) {
            setSprintData(sprintData);
          } else {
            console.error("Failed to fetch sprint metrics.");
          }
        } catch (error) {
          console.error("Error fetching sprint metrics:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMetrics();
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found. Redirecting...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--oracle-light-gray)] p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[var(--oracle-dark)] text-4xl font-semibold tracking-tight">
          [ Productivity Metrics ]
        </h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[var(--oracle-blue)] font-medium hover:text-[var(--oracle-dark)] transition duration-300"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Sprint Metrics Section */}
      <div className="mb-6">
        {/* Title Section */}
        <h2 className="text-3xl font-bold text-black mb-4">
          Sprint Metrics Overview
        </h2>
        <p className="text-base text-gray-600 mb-8 max-w-2xl">
          This section provides an overview of the sprint metrics, including
          sprint velocity and completion rate. These metrics give you insights
          into the team's productivity and performance during the sprint.
        </p>
        {/* Add padding to this section to create space between description and metrics */}
        <div className="mb-6"></div>{" "}
        {/* Optional: This can be increased to add more space if needed */}
        {/* Grid Section */}
        <div className="grid grid-cols-2 gap-8">
          {/* Sprint Velocity */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-semibold text-[var(--oracle-dark)] mb-2">
              Sprint Velocity
            </h3>
            <p className="text-5xl font-bold text-[var(--oracle-blue)]">
              {sprintData!.sprintVelocity} pts
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Story points per sprint
            </p>
          </div>

          {/* Sprint Completion Rate */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-semibold text-[var(--oracle-dark)] mb-2">
              Sprint Completion Rate
            </h3>
            <p className="text-5xl font-bold text-[var(--oracle-green)]">
              {sprintData!.completionRate}%
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Percentage of completed tasks per sprint
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
