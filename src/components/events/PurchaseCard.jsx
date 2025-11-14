import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Minus, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ConfirmDialog from "../common/ConfirmDialog";

export default function PurchaseCard({ 
  event, 
  availableTickets, 
  user,
  isPurchasing,
  onPurchase 
}) {
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const totalPrice = event.price * quantity;

  const handlePurchaseClick = () => {
    if (!user) {
      onPurchase(quantity);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onPurchase(quantity);
  };

  return (
    <>
      <div className="sticky top-20">
        <Card className="border-none shadow-2xl dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-orange-500 dark:to-orange-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Comprar Ingressos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Preço por ingresso</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                R$ {event.price?.toFixed(2)}
              </p>
            </div>

            {availableTickets > 0 ? (
              <>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Quantidade</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isPurchasing}
                      className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center dark:text-white">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}
                      disabled={quantity >= availableTickets || isPurchasing}
                      className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {quantity > 1 && (
                    <Alert className="mt-3 bg-blue-50 border-blue-200 dark:bg-purple-900/20 dark:border-purple-800">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-purple-400" />
                      <AlertDescription className="text-xs text-blue-900 dark:text-purple-300">
                        Cada ingresso terá seu próprio QR Code único
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700"
                    onClick={handlePurchaseClick}
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Ticket className="w-5 h-5 mr-2" />
                        Comprar Agora
                      </>
                    )}
                  </Button>

                  {!user && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                      Você será redirecionado para fazer login
                    </p>
                  )}
                </div>
              </>
            ) : (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-sm text-red-900 dark:text-red-300 font-semibold">
                  Ingressos Esgotados
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {user && (
        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          title="Confirmar Compra"
          description={`Você está prestes a comprar ${quantity} ingresso(s) para "${event.title}" no valor total de R$ ${totalPrice.toFixed(2)}. Deseja continuar?`}
          confirmLabel="Confirmar Compra"
          onConfirm={handleConfirm}
          isLoading={isPurchasing}
        />
      )}
    </>
  );
}