import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Droplets, Wind } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// TODO: Replace with actual data from Django API
const MOCK_DATA_HOURLY = [
  { time: "12 AM", temp: 68 },
  { time: "3 AM", temp: 66 },
  { time: "6 AM", temp: 65 },
  { time: "9 AM", temp: 70 },
  { time: "12 PM", temp: 75 },
  { time: "3 PM", temp: 78 },
  { time: "6 PM", temp: 74 },
  { time: "9 PM", temp: 70 },
];

const MOCK_DATA_DAILY = [
  { time: "Mon", temp: 72 },
  { time: "Tue", temp: 70 },
  { time: "Wed", temp: 73 },
  { time: "Thu", temp: 75 },
  { time: "Fri", temp: 74 },
  { time: "Sat", temp: 71 },
  { time: "Sun", temp: 72 },
];

const AREA_DETAILS: Record<string, any> = {
  "1": { name: "Davis Hall", temp: 72, high: 78, low: 65, status: "normal" },
  "2": { name: "Student Union", temp: 68, high: 72, low: 65, status: "cool" },
  "3": { name: "Capen Hall", temp: 75, high: 82, low: 70, status: "warm" },
  "4": { name: "Norton Hall", temp: 85, high: 95, low: 75, status: "hot" },
  "5": { name: "Ellicot Complex", temp: 65, high: 68, low: 60, status: "cool" },
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, areaData }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
        <p className="text-xl font-bold text-foreground mb-3">
          {payload[0].value}°F
        </p>
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-muted-foreground">High</p>
            <p className="text-sm font-semibold text-foreground">{areaData.high}°F</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="text-sm font-semibold text-foreground">{areaData.low}°F</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"hourly" | "daily">("hourly");

  const areaData = AREA_DETAILS[areaId || "1"];
  const chartData = timeRange === "hourly" ? MOCK_DATA_HOURLY : MOCK_DATA_DAILY;

  const getGradientClass = (status: string) => {
    switch (status) {
      case "cool":
        return "bg-gradient-cold";
      case "warm":
        return "bg-gradient-warm";
      case "hot":
        return "bg-gradient-hot";
      default:
        return "bg-gradient-cold";
    }
  };

  return (
    <div className={`h-screen flex flex-col ${getGradientClass(areaData.status)}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/area-selection")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Areas
        </Button>
        <div className="text-right text-white">
          <p className="text-sm opacity-80">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm opacity-80">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Main Content - 40/60 Split */}
      <div className="flex-1 flex gap-6 px-6 pb-6 min-h-0">
        {/* Left Side - 40% - Temperature and Metrics */}
        <div className="w-[40%] flex flex-col gap-6">
          {/* Main Temperature Display */}
          <GlassCard className="flex-1 p-8 flex flex-col justify-center text-center">
            <h1 className="text-3xl font-semibold text-white mb-2">{areaData.name}</h1>
            <p className="text-white/70 mb-8">Current conditions</p>
            
            <div className="text-8xl font-light text-white mb-6">
              {areaData.temp}°F
            </div>

            <div className="flex justify-center space-x-12 text-white/80">
              <div>
                <p className="text-sm">High</p>
                <p className="text-2xl font-semibold">{areaData.high}°F</p>
              </div>
              <div>
                <p className="text-sm">Low</p>
                <p className="text-2xl font-semibold">{areaData.low}°F</p>
              </div>
            </div>
          </GlassCard>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-white/20">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Humidity</p>
                  <p className="text-2xl font-semibold text-white">65%</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-white/20">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Air Flow</p>
                  <p className="text-2xl font-semibold text-white">Normal</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Side - 60% - Graph */}
        <div className="w-[60%]">
          <GlassCard className="h-full p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Temperature History</h2>
              <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "hourly" | "daily")}>
                <TabsList className="bg-white/10">
                  <TabsTrigger value="hourly" className="text-white data-[state=active]:bg-white/20">
                    Hourly
                  </TabsTrigger>
                  <TabsTrigger value="daily" className="text-white data-[state=active]:bg-white/20">
                    Daily
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" domain={[50, 100]} />
                  <Tooltip content={<CustomTooltip areaData={areaData} />} />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#fff"
                    strokeWidth={3}
                    dot={{ fill: "#fff", r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
