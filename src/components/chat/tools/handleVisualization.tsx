import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Wallet } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

// Define props interface
interface VisualizationToolProps {
  args: any;
}

export default function VisualizationTool({ args }: VisualizationToolProps) {
  console.log("Rendering visualization tool with args:", args);

  // Check if data might be nested in a 'data' property (common pattern)
  const processedArgs = args.data ? args.data : args;

  // Extract the chart data - handle different data structures
  let chartData, title, description;

  if (processedArgs.chartData) {
    // Direct structure: { chartData: [...], title: "...", description: "..." }
    chartData = processedArgs.chartData;
    title = processedArgs.title || "Portfolio Visualization";
    description = processedArgs.description || "Asset allocation breakdown";
  } else if (Array.isArray(processedArgs)) {
    // Array structure: just the chart data
    chartData = processedArgs;
    title = "Portfolio Visualization";
    description = "Asset allocation breakdown";
  } else {
    // If we can't find chartData, log error and try to adapt
    console.error("Could not determine chart data structure:", processedArgs);

    // Attempt to convert object to array if needed
    chartData = Array.isArray(processedArgs) ? processedArgs :
      Object.entries(processedArgs).map(([key, value]) => ({
        x: key,
        y: typeof value === 'number' ? value : 0
      }));

    title = "Data Visualization";
    description = "Available data representation";
  }

  // Add error handling
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    console.error("Invalid or empty chart data:", chartData);
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Visualization Error</CardTitle>
          <CardDescription>Could not generate chart with the provided data</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto p-2 bg-muted rounded">
            {JSON.stringify(args, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  }

  // Define portfolio colors - using a financial-themed palette
  const PORTFOLIO_COLORS = [
    "hsl(215, 70%, 60%)",    // Blue for stocks
    "hsl(160, 60%, 50%)",    // Green for bonds
    "hsl(45, 90%, 65%)",     // Gold/yellow for cash/precious metals
    "hsl(280, 60%, 65%)",    // Purple for crypto
    "hsl(355, 70%, 60%)",    // Red for real estate
    "hsl(190, 70%, 50%)",    // Teal for alternatives
    "hsl(30, 80%, 60%)",     // Orange for commodities
    "hsl(240, 60%, 70%)",    // Violet for international investments
  ];

  // Calculate total for percentage
  const total = chartData.reduce((sum: number, item: any) => sum + (Number(item.y) || 0), 0);

  // Create configuration for the chart
  const chartConfig = {
    valueKey: { label: "Allocation" },
    ...chartData.reduce((acc: any, item: any, index: number) => {
      acc[item.x] = {
        label: item.x,
        color: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length]
      };
      return acc;
    }, {})
  };

  // Return the pie chart component
  return (
    <Card className="w-full my-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Wallet className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value} (${((value / total) * 100).toFixed(1)}%)`}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="y"
              nameKey="x"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-4 flex flex-wrap justify-center gap-3">
        {chartData.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="mr-1.5 h-3 w-3 rounded-full"
              style={{ backgroundColor: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length] }}
            />
            <span className="text-xs font-medium">{entry.x}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}