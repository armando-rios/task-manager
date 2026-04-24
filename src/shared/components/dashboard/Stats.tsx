import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $projects } from "@shared/lib/stores/appStore";
import { $taskCounts, setTaskCounts } from "@shared/lib/taskStore";
import { MetricCard } from "./MetricCard";

interface Props {
  initialProjectCount: number;
  initialTaskCounts: {
    todo: number;
    inProgress: number;
    done: number;
  };
}

export function Stats({ initialProjectCount, initialTaskCounts }: Props) {
  const projects = useStore($projects);
  const taskCounts = useStore($taskCounts);

  // Initialize store once with SSR data
  useEffect(() => {
    setTaskCounts(initialTaskCounts);
  }, [initialTaskCounts]);

  // Use store values directly (store is initialized to {todo:0, inProgress:0, done:0})
  const projectCount =
    projects.length > 0 ? projects.length : initialProjectCount;
  const todo = taskCounts.todo;
  const inProgress = taskCounts.inProgress;
  const done = taskCounts.done;
  const totalTasks = todo + inProgress + done;

  return (
    <section className="shrink-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <MetricCard
          title="Projects"
          value={projectCount}
          icon="folder"
          variant="primary"
        />
        <MetricCard title="Tasks" value={totalTasks} icon="check-circle" />
        <MetricCard title="Completed" value={done} icon="check" />
        <MetricCard title="Uptime" value="99.9%" icon="activity" />
      </div>
    </section>
  );
}
