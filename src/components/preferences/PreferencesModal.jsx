import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const categories = [
  { value: "show", label: "Show" },
  { value: "teatro", label: "Teatro" },
  { value: "esporte", label: "Esporte" },
  { value: "festival", label: "Festival" },
  { value: "conferencia", label: "Conferência" },
  { value: "workshop", label: "Workshop" },
  { value: "outro", label: "Outro" },
];

const states = [
  { uf: "SP", name: "São Paulo" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "PR", name: "Paraná" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "BA", name: "Bahia" },
  { uf: "DF", name: "Distrito Federal" },
];

export default function PreferencesModal({ open, onOpenChange, user }) {
  const queryClient = useQueryClient();
  
  const { data: userPreferences } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      const prefs = await base44.entities.UserPreference.filter({ user_id: user.id });
      return prefs[0] || null;
    },
    enabled: !!user && open,
  });

  const [formData, setFormData] = useState({
    favorite_categories: [],
    preferred_states: [],
    preferred_cities: [],
    price_range_min: 0,
    price_range_max: 1000,
    notification_preferences: {
      new_events: true,
      recommendations: true,
      price_drops: true,
    }
  });

  useEffect(() => {
    if (userPreferences) {
      setFormData({
        favorite_categories: userPreferences.favorite_categories || [],
        preferred_states: userPreferences.preferred_states || [],
        preferred_cities: userPreferences.preferred_cities || [],
        price_range_min: userPreferences.price_range_min || 0,
        price_range_max: userPreferences.price_range_max || 1000,
        notification_preferences: userPreferences.notification_preferences || {
          new_events: true,
          recommendations: true,
          price_drops: true,
        }
      });
    }
  }, [userPreferences]);

  const savePreferencesMutation = useMutation({
    mutationFn: async (data) => {
      if (userPreferences) {
        return await base44.entities.UserPreference.update(userPreferences.id, {
          ...data,
          user_id: user.id,
        });
      } else {
        return await base44.entities.UserPreference.create({
          ...data,
          user_id: user.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences", user.id] });
      toast.success("Preferências salvas com sucesso!");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Erro ao salvar preferências");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    savePreferencesMutation.mutate(formData);
  };

  const toggleCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      favorite_categories: prev.favorite_categories.includes(category)
        ? prev.favorite_categories.filter(c => c !== category)
        : [...prev.favorite_categories, category]
    }));
  };

  const toggleState = (state) => {
    setFormData(prev => ({
      ...prev,
      preferred_states: prev.preferred_states.includes(state)
        ? prev.preferred_states.filter(s => s !== state)
        : [...prev.preferred_states, state]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Preferências de Eventos
          </DialogTitle>
          <DialogDescription>
            Configure suas preferências para receber recomendações personalizadas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Favorite Categories */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Categorias Favoritas
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.favorite_categories.includes(cat.value)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={formData.favorite_categories.includes(cat.value)}
                    onCheckedChange={() => toggleCategory(cat.value)}
                  />
                  <span className="text-sm">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred States */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Estados Preferidos
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {states.map((state) => (
                <div
                  key={state.uf}
                  onClick={() => toggleState(state.uf)}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                    formData.preferred_states.includes(state.uf)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={formData.preferred_states.includes(state.uf)}
                    onCheckedChange={() => toggleState(state.uf)}
                  />
                  <span>{state.uf}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Faixa de Preço Preferida
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_min" className="text-sm">Mínimo (R$)</Label>
                <Input
                  id="price_min"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.price_range_min}
                  onChange={(e) => setFormData({ ...formData, price_range_min: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="price_max" className="text-sm">Máximo (R$)</Label>
                <Input
                  id="price_max"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.price_range_max}
                  onChange={(e) => setFormData({ ...formData, price_range_max: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Preferências de Notificação
            </Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                <Checkbox
                  id="new_events"
                  checked={formData.notification_preferences.new_events}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        new_events: checked
                      }
                    })
                  }
                />
                <Label htmlFor="new_events" className="text-sm cursor-pointer flex-1">
                  Notificar sobre novos eventos nas minhas categorias favoritas
                </Label>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                <Checkbox
                  id="recommendations"
                  checked={formData.notification_preferences.recommendations}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        recommendations: checked
                      }
                    })
                  }
                />
                <Label htmlFor="recommendations" className="text-sm cursor-pointer flex-1">
                  Receber recomendações personalizadas
                </Label>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                <Checkbox
                  id="price_drops"
                  checked={formData.notification_preferences.price_drops}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        price_drops: checked
                      }
                    })
                  }
                />
                <Label htmlFor="price_drops" className="text-sm cursor-pointer flex-1">
                  Alertar sobre quedas de preço em eventos salvos
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={savePreferencesMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {savePreferencesMutation.isPending ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Preferências
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}