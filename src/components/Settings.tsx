import { useState } from "react";
import { User, Palette, Bell, Lock, Globe, Save, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function Settings() {
  const [selectedTheme, setSelectedTheme] = useState("burgundy");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  // Profile data
  const [doctorName, setDoctorName] = useState("Dr. Roberto Silva");
  const [clinicName, setClinicName] = useState("DentalCare");
  const [cro, setCro] = useState("CRO 12345");
  const [email, setEmail] = useState("roberto.silva@dentalcare.com");
  const [phone, setPhone] = useState("(11) 98765-4321");
  const [language, setLanguage] = useState("pt-BR");

  const themes: ThemeOption[] = [
    {
      id: "burgundy",
      name: "Vinho Elegante",
      description: "Tema vinho escuro e bege nude (atual)",
      preview: {
        primary: "#7A2B45",
        secondary: "#F5E6D3",
        accent: "#8B3A57"
      }
    },
    {
      id: "dark",
      name: "Modo Escuro",
      description: "Tema escuro profissional",
      preview: {
        primary: "#1F2937",
        secondary: "#374151",
        accent: "#6366F1"
      }
    },
    {
      id: "nude",
      name: "Nude Minimalista",
      description: "Tons claros e neutros",
      preview: {
        primary: "#9CA3AF",
        secondary: "#F9FAFB",
        accent: "#D1D5DB"
      }
    },
    {
      id: "medical",
      name: "Azul Médico",
      description: "Tons azul e verde hospitalar",
      preview: {
        primary: "#0891B2",
        secondary: "#E0F2FE",
        accent: "#06B6D4"
      }
    }
  ];

  const applyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    
    const root = document.documentElement;
    
    switch (themeId) {
      case "burgundy":
        root.style.setProperty('--color-primary-50', '#fdf8f9');
        root.style.setProperty('--color-primary-100', '#f9e8ed');
        root.style.setProperty('--color-primary-200', '#f4d2dd');
        root.style.setProperty('--color-primary-300', '#e8a5ba');
        root.style.setProperty('--color-primary-400', '#d77997');
        root.style.setProperty('--color-primary-500', '#c14d74');
        root.style.setProperty('--color-primary-600', '#7A2B45');
        root.style.setProperty('--color-primary-700', '#5C1F34');
        root.style.setProperty('--color-primary-800', '#4a1929');
        root.style.setProperty('--color-primary-900', '#3d1421');
        root.style.setProperty('--color-neutral-50', '#fdfcfb');
        root.style.setProperty('--color-neutral-100', '#F5E6D3');
        root.style.setProperty('--color-neutral-200', '#E8D5C4');
        break;
      
      case "dark":
        root.style.setProperty('--color-primary-50', '#f0f1f3');
        root.style.setProperty('--color-primary-100', '#e2e4e9');
        root.style.setProperty('--color-primary-200', '#c5c9d3');
        root.style.setProperty('--color-primary-300', '#9ca3af');
        root.style.setProperty('--color-primary-400', '#6b7280');
        root.style.setProperty('--color-primary-500', '#4b5563');
        root.style.setProperty('--color-primary-600', '#374151');
        root.style.setProperty('--color-primary-700', '#1F2937');
        root.style.setProperty('--color-primary-800', '#111827');
        root.style.setProperty('--color-primary-900', '#030712');
        root.style.setProperty('--color-neutral-50', '#f9fafb');
        root.style.setProperty('--color-neutral-100', '#f3f4f6');
        root.style.setProperty('--color-neutral-200', '#e5e7eb');
        break;
      
      case "nude":
        root.style.setProperty('--color-primary-50', '#fafaf9');
        root.style.setProperty('--color-primary-100', '#f5f5f4');
        root.style.setProperty('--color-primary-200', '#e7e5e4');
        root.style.setProperty('--color-primary-300', '#d6d3d1');
        root.style.setProperty('--color-primary-400', '#a8a29e');
        root.style.setProperty('--color-primary-500', '#78716c');
        root.style.setProperty('--color-primary-600', '#57534e');
        root.style.setProperty('--color-primary-700', '#44403c');
        root.style.setProperty('--color-primary-800', '#292524');
        root.style.setProperty('--color-primary-900', '#1c1917');
        root.style.setProperty('--color-neutral-50', '#fafaf9');
        root.style.setProperty('--color-neutral-100', '#f5f5f4');
        root.style.setProperty('--color-neutral-200', '#e7e5e4');
        break;
      
      case "medical":
        root.style.setProperty('--color-primary-50', '#ecfeff');
        root.style.setProperty('--color-primary-100', '#cffafe');
        root.style.setProperty('--color-primary-200', '#a5f3fc');
        root.style.setProperty('--color-primary-300', '#67e8f9');
        root.style.setProperty('--color-primary-400', '#22d3ee');
        root.style.setProperty('--color-primary-500', '#06B6D4');
        root.style.setProperty('--color-primary-600', '#0891B2');
        root.style.setProperty('--color-primary-700', '#0e7490');
        root.style.setProperty('--color-primary-800', '#155e75');
        root.style.setProperty('--color-primary-900', '#164e63');
        root.style.setProperty('--color-neutral-50', '#f0fdfa');
        root.style.setProperty('--color-neutral-100', '#ccfbf1');
        root.style.setProperty('--color-neutral-200', '#99f6e4');
        break;
    }
  };

  const handleSaveSettings = () => {
    console.log("Configurações salvas:", {
      doctorName,
      clinicName,
      cro,
      email,
      phone,
      theme: selectedTheme,
      notifications: {
        enabled: notificationsEnabled,
        email: emailNotifications,
        sms: smsNotifications
      }
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary-900">Configurações</h1>
          <p className="text-neutral-600 mt-1">Gerencie preferências e dados da clínica</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-neutral-200">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="theme" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            <Palette className="w-4 h-4 mr-2" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            <Lock className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary-900">Informações do Profissional</CardTitle>
              <p className="text-neutral-600 text-sm">Dados pessoais e da clínica</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-primary-200">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary-600 text-neutral-50 text-2xl">
                    RS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="border-primary-300 text-primary-700">
                    <Camera className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <p className="text-xs text-neutral-600 mt-2">JPG, PNG ou GIF (máx. 2MB)</p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="doctorName" className="text-neutral-700">Nome do Dentista</Label>
                  <Input
                    id="doctorName"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="border-primary-300 focus:border-primary-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cro" className="text-neutral-700">CRO</Label>
                  <Input
                    id="cro"
                    value={cro}
                    onChange={(e) => setCro(e.target.value)}
                    className="border-primary-300 focus:border-primary-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicName" className="text-neutral-700">Nome da Clínica</Label>
                  <Input
                    id="clinicName"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="border-primary-300 focus:border-primary-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-neutral-700">Telefone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-primary-300 focus:border-primary-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-700">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-primary-300 focus:border-primary-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-neutral-700">Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="border-primary-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="mt-6 space-y-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary-900">Aparência da Plataforma</CardTitle>
              <p className="text-neutral-600 text-sm">Escolha o tema visual que mais combina com você</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTheme === theme.id
                        ? 'border-primary-600 bg-primary-50/30 shadow-md'
                        : 'border-neutral-300 hover:border-primary-400'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-primary-900 mb-1">{theme.name}</h4>
                        <p className="text-neutral-600 text-sm">{theme.description}</p>
                      </div>
                      {selectedTheme === theme.id && (
                        <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Color Preview */}
                    <div className="flex gap-2">
                      <div 
                        className="w-12 h-12 rounded-lg border border-neutral-300"
                        style={{ backgroundColor: theme.preview.primary }}
                      />
                      <div 
                        className="w-12 h-12 rounded-lg border border-neutral-300"
                        style={{ backgroundColor: theme.preview.secondary }}
                      />
                      <div 
                        className="w-12 h-12 rounded-lg border border-neutral-300"
                        style={{ backgroundColor: theme.preview.accent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary-900">Preferências de Notificação</CardTitle>
              <p className="text-neutral-600 text-sm">Configure como deseja receber alertas</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-300">
                <div>
                  <h4 className="text-primary-900 mb-1">Notificações do Sistema</h4>
                  <p className="text-neutral-600 text-sm">Receber alertas na plataforma</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-300">
                <div>
                  <h4 className="text-primary-900 mb-1">Notificações por E-mail</h4>
                  <p className="text-neutral-600 text-sm">Receber resumos e alertas por e-mail</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-300">
                <div>
                  <h4 className="text-primary-900 mb-1">Notificações por SMS</h4>
                  <p className="text-neutral-600 text-sm">Receber lembretes de consulta via SMS</p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <Separator />

              <div>
                <h4 className="text-primary-900 mb-4">Tipos de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                    <span className="text-neutral-700 text-sm">Novas consultas agendadas</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                    <span className="text-neutral-700 text-sm">Cancelamentos de consultas</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                    <span className="text-neutral-700 text-sm">Lembretes de consulta (24h antes)</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                    <span className="text-neutral-700 text-sm">Pagamentos recebidos</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                    <span className="text-neutral-700 text-sm">Aniversários de pacientes</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary-900">Segurança e Privacidade</CardTitle>
              <p className="text-neutral-600 text-sm">Proteja sua conta e dados</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-neutral-700">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Digite sua senha atual"
                    className="border-primary-300 focus:border-primary-600 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-neutral-700">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Digite sua nova senha"
                    className="border-primary-300 focus:border-primary-600 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-neutral-700">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    className="border-primary-300 focus:border-primary-600 mt-2"
                  />
                </div>

                <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
                  Alterar Senha
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-300">
                <div>
                  <h4 className="text-primary-900 mb-1">Autenticação de Dois Fatores</h4>
                  <p className="text-neutral-600 text-sm">Adicione uma camada extra de segurança</p>
                </div>
                <Button variant="outline" className="border-primary-300 text-primary-700">
                  Ativar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-300">
                <div>
                  <h4 className="text-primary-900 mb-1">Backup Automático</h4>
                  <p className="text-neutral-600 text-sm">Backup diário dos dados da clínica</p>
                </div>
                <Switch
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              </div>

              <div className="p-4 rounded-lg border border-neutral-300">
                <h4 className="text-primary-900 mb-3">Sessões Ativas</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                    <div>
                      <p className="text-sm text-neutral-900">Chrome - Windows</p>
                      <p className="text-xs text-neutral-600">São Paulo, BR • Ativo agora</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Encerrar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                    <div>
                      <p className="text-sm text-neutral-900">Safari - iPhone</p>
                      <p className="text-xs text-neutral-600">São Paulo, BR • Há 2 horas</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Encerrar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
