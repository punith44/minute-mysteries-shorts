import React from "react";
import type { WidgetSpec } from "../../schema/reelSchema";
import { ChecklistCard } from "./ChecklistCard";
import { MetricCounterCard } from "./MetricCounterCard";
import { NotificationStackCard } from "./NotificationStackCard";
import { ComparisonGridCard } from "./ComparisonGridCard";
import { ChartTrendCard } from "./ChartTrendCard";
import { DiagramCard } from "./DiagramCard";
import { VideoClipCard } from "./VideoClipCard";
import { VisualSceneCard } from "./VisualSceneCard";

interface WidgetRegistryProps {
  widget: WidgetSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

/**
 * Dispatches any declarative `WidgetSpec` to its reusable visual renderer.
 */
export const WidgetRegistry: React.FC<WidgetRegistryProps> = ({
  widget,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  switch (widget.type) {
    case "checklist":
      return (
        <ChecklistCard
          spec={widget}
          currentTimeSec={currentTimeSec}
          springOvershoot={springOvershoot}
        />
      );
    case "metric_counter":
      return (
        <MetricCounterCard
          spec={widget}
          currentTimeSec={currentTimeSec}
          springOvershoot={springOvershoot}
        />
      );
    case "notification_stack":
      return (
        <NotificationStackCard
          spec={widget}
          currentTimeSec={currentTimeSec}
          springOvershoot={springOvershoot}
        />
      );
    case "comparison_grid":
      return (
        <ComparisonGridCard
          spec={widget}
          currentTimeSec={currentTimeSec}
          springOvershoot={springOvershoot}
        />
      );
    case "chart_trend":
      return (
        <ChartTrendCard
          spec={widget}
          currentTimeSec={currentTimeSec}
          springOvershoot={springOvershoot}
        />
      );
    case "physics_diagram":
      return (
        <DiagramCard
          spec={widget}
          currentTimeSec={currentTimeSec}
          springOvershoot={springOvershoot}
        />
      );
    case "video_clip":
      return (
        <VideoClipCard
          spec={widget}
          currentTimeSec={currentTimeSec}
          springOvershoot={springOvershoot}
        />
      );
    case "visual_scene":
      return (
        <VisualSceneCard
          spec={widget}
          currentTimeSec={currentTimeSec}
          springOvershoot={springOvershoot}
        />
      );
  }
};
