import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Send, AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

const ratingLabels = {
  1: { label: "Péssimo", emoji: "😞", color: "text-red-600" },
  2: { label: "Ruim", emoji: "😕", color: "text-orange-600" },
  3: { label: "Regular", emoji: "😐", color: "text-yellow-600" },
  4: { label: "Bom", emoji: "😊", color: "text-blue-600" },
  5: { label: "Excelente", emoji: "😍", color: "text-green-600" }
};

export default function ReviewForm({ onSubmit, isSubmitting }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = "Por favor, selecione uma avaliação";
    }
    
    if (comment.length > 0 && comment.length < 10) {
      newErrors.comment = "O comentário deve ter pelo menos 10 caracteres";
    }
    
    if (comment.length > 500) {
      newErrors.comment = "O comentário não pode ter mais de 500 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setTouched({ rating: true, comment: true });
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ rating, comment: comment.trim() });
      setRating(0);
      setComment("");
      setTouched({});
      setErrors({});
    }
  };

  const handleRatingClick = (star) => {
    setRating(star);
    setTouched({ ...touched, rating: true });
    if (errors.rating) {
      setErrors({ ...errors, rating: null });
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
    
    if (touched.comment) {
      const newErrors = { ...errors };
      if (value.length > 0 && value.length < 10) {
        newErrors.comment = "Mínimo de 10 caracteres";
      } else if (value.length > 500) {
        newErrors.comment = "Máximo de 500 caracteres";
      } else {
        delete newErrors.comment;
      }
      setErrors(newErrors);
    }
  };

  const handleCommentBlur = () => {
    setTouched({ ...touched, comment: true });
  };

  const currentRating = hoveredRating || rating;

  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Star className="w-6 h-6 text-blue-600 fill-blue-600" />
          Deixe sua Avaliação
        </CardTitle>
        <CardDescription className="text-base">
          Sua opinião é muito importante para outros participantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div>
            <Label className="mb-4 block text-lg font-semibold text-gray-900">
              Como foi sua experiência? *
            </Label>
            
            <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-200 hover:scale-125 focus:scale-125 focus:outline-none active:scale-110"
                    aria-label={`Avaliar com ${star} estrela${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-12 h-12 transition-all duration-200 ${
                        star <= currentRating
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              {currentRating > 0 && (
                <div className="text-center space-y-2">
                  <p className="text-4xl animate-bounce">
                    {ratingLabels[currentRating].emoji}
                  </p>
                  <p className={`text-xl font-bold ${ratingLabels[currentRating].color}`}>
                    {ratingLabels[currentRating].label}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentRating} de 5 estrelas
                  </p>
                </div>
              )}
            </div>

            {touched.rating && errors.rating && (
              <Alert className="mt-3 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm font-medium">
                  {errors.rating}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Comment Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label htmlFor="comment" className="text-base font-semibold text-gray-900">
                Conte-nos mais sobre sua experiência (opcional)
              </Label>
              <span className={`text-xs font-semibold ${
                comment.length > 500 ? 'text-red-600' : 
                comment.length > 450 ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {comment.length}/500
              </span>
            </div>
            
            <Textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              onBlur={handleCommentBlur}
              placeholder="O que você mais gostou? O que poderia melhorar? Compartilhe detalhes sobre organização, qualidade, atendimento..."
              rows={5}
              className={`resize-none transition-all ${
                touched.comment && errors.comment 
                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                  : 'focus:border-blue-500'
              }`}
            />
            
            {touched.comment && errors.comment && (
              <Alert className="mt-3 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm font-medium">
                  {errors.comment}
                </AlertDescription>
              </Alert>
            )}

            {comment.length >= 10 && !errors.comment && (
              <Alert className="mt-3 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm font-medium">
                  Ótimo! Seu comentário está bem detalhado 👍
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Tips Alert */}
          <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong>💡 Dica:</strong> Avaliações detalhadas ajudam muito! Mencione:
              qualidade do evento, organização, local, atendimento, preço-benefício, etc.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Publicando Avaliação...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Publicar Avaliação
              </>
            )}
          </Button>

          {/* Info Text */}
          <p className="text-xs text-center text-gray-600 italic">
            ✨ Sua avaliação ajuda outros participantes a conhecerem melhor este evento
          </p>
        </form>
      </CardContent>
    </Card>
  );
}