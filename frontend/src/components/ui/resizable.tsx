"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";

import { cn } from "./utils";

// 🔹 Panel Group
function ResizablePanelGroup({ className, ...props }: any) {
  return (
    <PanelGroup
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

// 🔹 Panel
function ResizablePanel(props: any) {
  return <Panel {...props} />;
}

// 🔹 Handle (barra para redimensionar)
function ResizableHandle({ withHandle, className, ...props }: any) {
  return (
    <PanelResizeHandle
      className={cn(
        "bg-border relative flex w-px items-center justify-center",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border">
          <GripVerticalIcon className="w-3 h-3" />
        </div>
      )}
    </PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };