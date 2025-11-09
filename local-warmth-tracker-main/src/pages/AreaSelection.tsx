import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// TODO: Replace with actual areas from Django API
const AREAS = [
  { id: 1, name: "Davis Hall", temperature: 72, status: "normal" },
  { id: 2, name: "Student Union", temperature: 68, status: "cool" },
  { id: 3, name: "Capen Hall", temperature: 75, status: "warm" },
  { id: 4, name: "Norton Hall", temperature: 85, status: "hot" },
  { id: 5, name: "Ellicott complex", temperature: 65, status: "cool" },
];

const AreaSelection = () => {
  const navigate = useNavigate();

  const handleAreaSelect = (areaId: number) => {
    navigate(`/dashboard/${areaId}`);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Select Monitoring Area</h1>
          <p className="text-muted-foreground">Choose an area to view detailed temperature data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AREAS.map((area) => (
            <GlassCard
              key={area.id}
              variant="elevated"
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${getGradientClass(area.status)}`}
              onClick={() => handleAreaSelect(area.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-white/20">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{area.name}</h3>
                    <p className="text-white/70 text-sm">Active monitoring</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{area.temperature}°F</div>
                  <ChevronRight className="w-6 h-6 text-white/70 ml-auto mt-2" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="bg-white/10 border-white/20 text-foreground hover:bg-white/20"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AreaSelection;
