// src/components/chat/tools/ToolManager.tsx
import { memo } from 'react';
import VisualizationTool from './handleVisualization';
import ToolResultCard from './ToolResultCard';
import { ToolInvocation, isWalletTool } from './types';
import WalletConfirmation from './WalletConfirmation';

interface ToolManagerProps {
  toolInvocation: ToolInvocation;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
}

function ToolManager({ toolInvocation, addToolResult }: ToolManagerProps) {
  const { toolCallId, toolName, state, result, args } = toolInvocation;

  console.log(`ToolManager: ${toolName} in ${state} state`, args);

  // For partial call state
  if (state === "partial-call") {
    return (
      <div className="text-muted-foreground mt-2">
        <p className="text-sm">Preparing to run {toolName}...</p>
      </div>
    );
  }

  // For complete call state
  if (state === "call") {
    // Check if this is the visualization tool
    if (toolName === "displayresults") {
      return <VisualizationTool args={args} />;
    }

    // For wallet tools that need confirmation
    if (isWalletTool(toolName)) {
      return (
        <WalletConfirmation
          toolCallId={toolCallId}
          toolName={toolName}
          args={args}
          addToolResult={addToolResult}
        />
      );
    }

    // For non-wallet tools, show a preparation message
    return (
      <div className="text-muted-foreground px-4 py-3 bg-muted/30 my-2 rounded-md">
        <p className="text-sm">Executing {toolName}...</p>
      </div>
    );
  }

  // For result state (tool has completed)
  if (state === "result" && result) {
    // CRITICAL FIX: Always render the visualization component for displayresults
    if (toolName === "displayresults") {
      // If the result contains processed data, use it
      // Otherwise fallback to the original args
      let visualizationData = args;
      try {
        if (typeof result === 'string') {
          const parsedResult = JSON.parse(result);
          // If the result contains data we can use, use that instead of the original args
          if (parsedResult.chartData || parsedResult.data) {
            visualizationData = parsedResult;
          }
        }
      } catch (e) {
        console.error("Error parsing visualization result:", e);
      }

      return <VisualizationTool args={visualizationData} />;
    }

    // For other tools, parse result to determine success or failure
    let isSuccess = true;
    let errorMessage = '';

    try {
      if (typeof result === 'string') {
        const parsedResult = JSON.parse(result);
        isSuccess = parsedResult.success !== false;
        errorMessage = parsedResult.error || '';
      }
    } catch (e) {
      // If parsing fails, check if result contains error keywords
      isSuccess = !String(result).toLowerCase().includes('error') &&
        !String(result).toLowerCase().includes('fail');
    }

    return (
      <ToolResultCard
        toolName={toolName}
        result={typeof result === 'string' ? result : JSON.stringify(result)}
        success={isSuccess}
        error={errorMessage}
        action={toolName}
      />
    );
  }

  // Fallback for any other state
  return null;
}

export default memo(ToolManager);