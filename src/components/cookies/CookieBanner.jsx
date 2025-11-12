import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Cookie, X, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary));
    setPreferences(onlyNecessary);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setShowPreferences(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 animate-in slide-in-from-bottom duration-300">
        <Card className="max-w-7xl mx-auto border-none shadow-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-start gap-2 flex-1">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Este site usa cookies 🍪
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Usamos cookies para melhorar sua experiência. Ao clicar em "Aceitar todos", você concorda com o uso de todos os cookies.{" "}
                    <Link
                      to={createPageUrl("PoliticaCookies")}
                      className="text-blue-600 hover:underline"
                    >
                      Saiba mais
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 md:flex-none text-xs h-8"
                >
                  <Settings className="w-3.5 h-3.5 mr-1.5" />
                  Preferências
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="flex-1 md:flex-none text-xs h-8"
                >
                  Rejeitar
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none text-xs h-8"
                >
                  Aceitar todos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferences Dialog */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Cookie className="w-5 h-5 text-blue-600" />
              Preferências de Cookies
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <Label className="text-sm font-semibold text-gray-900">
                  Cookies Necessários
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Essenciais para o funcionamento do site. Não podem ser desativados.
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <Label className="text-sm font-semibold text-gray-900">
                  Cookies de Análise
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nos ajudam a entender como os visitantes usam o site.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <Label className="text-sm font-semibold text-gray-900">
                  Cookies de Marketing
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Usados para exibir anúncios relevantes para você.
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketing: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPreferences(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700">
              Salvar Preferências
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}