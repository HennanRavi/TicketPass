import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel 
}) {
  return (
    <Card className="border-none shadow-xl">
      <CardContent className="p-12 text-center">
        {Icon && (
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
        {action && actionLabel && (
          <Button onClick={action} size="lg">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}