import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreateRestaurantData } from "@/types/restaurant";
import { Store, Plus, Upload, Trash2 } from "lucide-react";

interface RestaurantFormProps {
  onSubmit: (data: CreateRestaurantData) => Promise<void>;
  onSuccess?: () => void;
}

export const RestaurantForm = ({ onSubmit, onSuccess }: RestaurantFormProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [mainColor, setMainColor] = useState("#e53e3e");
  const [secondColor, setSecondColor] = useState("#fc8181");
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagem(null);
    setImagemPreview(null);
  };

  const generateSlug = (value: string) => {
    const newSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(newSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast.error("Erro de Validação", {
        description: "Nome e Slug são obrigatórios",
        style: {
          backgroundColor: '#fff1f2',
          color: '#ef4444'
        }
      });
      return;
    }

    setLoading(true);
    await onSubmit({
      nome: name.trim(),
      slug: slug.trim(),
      main_color: mainColor,
      second_color: secondColor,
      img: imagem || undefined
    });
    setLoading(false);
  };

  return (
    <Card className="shadow-lg border-0 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-admin-500 to-admin-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-6 h-6" />
          <span>Cadastrar Novo Restaurante</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome do Restaurante *
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                generateSlug(e.target.value);
              }}
              placeholder="Ex: Pizzaria Bella Vista"
              className="border-gray-300 focus:border-admin-500 focus:ring-admin-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
              Slug *
            </Label>
            <Input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="pizzaria-bella-vista"
              className="border-gray-300 focus:border-admin-500 focus:ring-admin-500"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="main_color" className="text-sm font-medium text-gray-700">
                Cor Principal *
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="main_color"
                  type="color"
                  value={mainColor}
                  onChange={(e) => setMainColor(e.target.value)}
                  className="w-16 h-10 p-1 border-gray-300"
                  disabled={loading}
                />
                <Input
                  type="text"
                  value={mainColor}
                  onChange={(e) => setMainColor(e.target.value)}
                  placeholder="#e53e3e"
                  className="flex-1 border-gray-300 focus:border-admin-500 focus:ring-admin-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="second_color" className="text-sm font-medium text-gray-700">
                Cor Secundária *
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="second_color"
                  type="color"
                  value={secondColor}
                  onChange={(e) => setSecondColor(e.target.value)}
                  className="w-16 h-10 p-1 border-gray-300"
                  disabled={loading}
                />
                <Input
                  type="text"
                  value={secondColor}
                  onChange={(e) => setSecondColor(e.target.value)}
                  placeholder="#fc8181"
                  className="flex-1 border-gray-300 focus:border-admin-500 focus:ring-admin-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem" className="text-sm font-medium text-gray-700">
              Logo do Restaurante
            </Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                className="relative"
                disabled={loading}
                onClick={() => document.getElementById('imagem-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Carregar Imagem
              </Button>
              <Input
                id="imagem-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              {imagemPreview && (
                <div className="relative">
                  <img
                    src={imagemPreview}
                    alt="Preview do logo"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-admin-500 to-admin-600 hover:from-admin-600 hover:to-admin-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Cadastrando...
              </>
            ) : (
              <>
                <Store className="w-4 h-4 mr-2" />
                Cadastrar Restaurante
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
