import { GlowCard } from "@/components/ui/spotlight-card";
import { Gauge, Crosshair, Trophy } from "lucide-react";

export function Default() {
  return (
    <div className="min-h-screen flex flex-wrap items-center justify-center gap-10 bg-slate-950 p-10">
      <GlowCard glowColor="blue">
        <Crosshair className="size-6 text-blue-300" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold text-white">Visée</h3>
          <p className="text-sm text-slate-400">Trouvez la sensibilité qui vous va.</p>
        </div>
      </GlowCard>

      <GlowCard glowColor="purple">
        <Gauge className="size-6 text-purple-300" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold text-white">Réglages</h3>
          <p className="text-sm text-slate-400">Convertissez vos réglages entre jeux.</p>
        </div>
      </GlowCard>

      <GlowCard glowColor="orange">
        <Trophy className="size-6 text-orange-300" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold text-white">Progression</h3>
          <p className="text-sm text-slate-400">Suivez vos résultats dans le temps.</p>
        </div>
      </GlowCard>
    </div>
  );
}
