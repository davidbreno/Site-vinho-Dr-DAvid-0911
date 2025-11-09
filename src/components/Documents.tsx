import { useState } from "react";
import { FileText, Download, Upload, Search, Folder, File, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Documents() {
  const [searchTerm, setSearchTerm] = useState("");

  const documentCategories = [
    {
      id: "medical-records",
      name: "Prontuários",
      icon: FileText,
      count: 245,
      color: "bg-primary-50 text-primary-600"
    },
    {
      id: "exams",
      name: "Exames",
      icon: File,
      count: 189,
      color: "bg-blue-50 text-blue-600"
    },
    {
      id: "prescriptions",
      name: "Receitas",
      icon: FileText,
      count: 432,
      color: "bg-green-50 text-green-600"
    },
    {
      id: "certificates",
      name: "Atestados",
      icon: FileText,
      count: 78,
      color: "bg-amber-50 text-amber-600"
    },
    {
      id: "contracts",
      name: "Contratos",
      icon: Folder,
      count: 156,
      color: "bg-purple-50 text-purple-600"
    },
    {
      id: "administrative",
      name: "Administrativos",
      icon: Folder,
      count: 92,
      color: "bg-neutral-100 text-neutral-600"
    }
  ];

  const recentDocuments = [
    {
      id: 1,
      name: "Receita - Maria Santos",
      patient: "Maria Santos",
      type: "Receita Médica",
      date: "08/11/2024",
      size: "45 KB",
      category: "prescriptions"
    },
    {
      id: 2,
      name: "Atestado - João Silva",
      patient: "João Silva",
      type: "Atestado Médico",
      date: "07/11/2024",
      size: "38 KB",
      category: "certificates"
    },
    {
      id: 3,
      name: "Prontuário - Ana Oliveira",
      patient: "Ana Oliveira",
      type: "Prontuário Completo",
      date: "06/11/2024",
      size: "156 KB",
      category: "medical-records"
    },
    {
      id: 4,
      name: "Raio-X - Pedro Costa",
      patient: "Pedro Costa",
      type: "Exame Radiológico",
      date: "05/11/2024",
      size: "2.3 MB",
      category: "exams"
    },
    {
      id: 5,
      name: "Contrato - Julia Ferreira",
      patient: "Julia Ferreira",
      type: "Contrato de Tratamento",
      date: "04/11/2024",
      size: "89 KB",
      category: "contracts"
    },
    {
      id: 6,
      name: "Anamnese - Carlos Mendes",
      patient: "Carlos Mendes",
      type: "Ficha de Anamnese",
      date: "03/11/2024",
      size: "52 KB",
      category: "medical-records"
    },
    {
      id: 7,
      name: "Receita - Roberto Alves",
      patient: "Roberto Alves",
      type: "Receita Médica",
      date: "02/11/2024",
      size: "41 KB",
      category: "prescriptions"
    },
    {
      id: 8,
      name: "Orçamento - Beatriz Lima",
      patient: "Beatriz Lima",
      type: "Orçamento de Tratamento",
      date: "01/11/2024",
      size: "67 KB",
      category: "contracts"
    }
  ];

  const templates = [
    {
      id: 1,
      name: "Modelo de Receita Padrão",
      description: "Receituário médico odontológico padrão",
      category: "Receitas"
    },
    {
      id: 2,
      name: "Modelo de Atestado",
      description: "Atestado médico para afastamento",
      category: "Atestados"
    },
    {
      id: 3,
      name: "Ficha de Anamnese Completa",
      description: "Questionário de saúde detalhado",
      category: "Prontuários"
    },
    {
      id: 4,
      name: "Contrato de Tratamento Ortodôntico",
      description: "Contrato específico para ortodontia",
      category: "Contratos"
    },
    {
      id: 5,
      name: "Termo de Consentimento",
      description: "Autorização para procedimentos",
      category: "Administrativo"
    },
    {
      id: 6,
      name: "Orçamento Detalhado",
      description: "Modelo de orçamento completo",
      category: "Contratos"
    }
  ];

  const filteredDocuments = recentDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryBadge = (category: string) => {
    const cat = documentCategories.find(c => c.id === category);
    return cat ? (
      <Badge className={`${cat.color} border-0`}>
        {cat.name}
      </Badge>
    ) : null;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary-900">Documentos</h1>
          <p className="text-neutral-600 mt-1">Gerenciar documentos e arquivos da clínica</p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
          <Upload className="w-4 h-4 mr-2" />
          Upload de Arquivo
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {documentCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id} className="border-primary-900 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary-400">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-xl ${category.color} mx-auto flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-primary-900 mb-1">{category.name}</h4>
                <p className="text-neutral-600 text-sm">{category.count} arquivos</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <Card className="border-primary-900 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <Input
              type="text"
              placeholder="Buscar documentos por nome, paciente ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-neutral-200">
          <TabsTrigger value="recent" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            <FileText className="w-4 h-4 mr-2" />
            Documentos Recentes
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            <Folder className="w-4 h-4 mr-2" />
            Modelos
          </TabsTrigger>
        </TabsList>

        {/* Recent Documents */}
        <TabsContent value="recent" className="mt-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary-900">Documentos Recentes</CardTitle>
              <p className="text-neutral-600 text-sm">Últimos arquivos criados ou modificados</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-lg border border-neutral-300 hover:bg-primary-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-primary-900 truncate">{doc.name}</h4>
                            {getCategoryBadge(doc.category)}
                          </div>
                          <p className="text-neutral-600 text-sm">{doc.type}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {doc.patient}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {doc.date}
                            </div>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-600">Nenhum documento encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="mt-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary-900">Modelos de Documentos</CardTitle>
              <p className="text-neutral-600 text-sm">Templates prontos para uso</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg border border-neutral-300 hover:bg-primary-50/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-primary-900 mb-1">{template.name}</h4>
                        <p className="text-neutral-600 text-sm mb-3">{template.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary-100 text-primary-800 border-primary-200">
                            {template.category}
                          </Badge>
                          <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-neutral-50 ml-auto">
                            <Download className="w-3 h-3 mr-1" />
                            Usar Modelo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Storage Info */}
      <Card className="border-primary-900 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-primary-900">Armazenamento</h4>
            <p className="text-neutral-600 text-sm">3.2 GB de 10 GB utilizados</p>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all"
              style={{ width: '32%' }}
            />
          </div>
          <p className="text-xs text-neutral-600 mt-2">6.8 GB disponíveis</p>
        </CardContent>
      </Card>
    </div>
  );
}
