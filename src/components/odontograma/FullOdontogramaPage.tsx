import React, { useState } from 'react';
import Odontograma from './Odontograma';
import { ToothInfo, ToothStatus } from './types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import type { Patient } from '../../types/patient';

interface ProcedimentoPorDente {
  toothId: string;
  descricao: string;
  status: ToothStatus;
  valor?: number;
}

interface FullOdontogramaPageProps {
  patient: Patient;
  initialData?: Record<string, ToothInfo>;
  onBack: () => void;
}

// Página Fullscreen do odontograma com painel lateral de procedimentos
const FullOdontogramaPage: React.FC<FullOdontogramaPageProps> = ({ patient, initialData = {}, onBack }) => {
  const [dados, setDados] = useState<Record<string, ToothInfo>>(initialData);
  const [procedimentos, setProcedimentos] = useState<ProcedimentoPorDente[]>([]);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<string>('');

  const handleAddProcedimento = () => {
    if (!selectedTooth || !descricao.trim()) return;
    const toothInfo = dados[selectedTooth];
    const novo: ProcedimentoPorDente = { toothId: selectedTooth, descricao: descricao.trim(), status: (toothInfo?.status ?? 'saudavel'), valor: valor ? parseFloat(valor) : undefined };
    setProcedimentos(prev => ([...prev, novo]));
    setDescricao('');
    setValor('');
  };

  const handleToothClick = (id: string) => {
    setSelectedTooth(id);
  };

  const removerProcedimento = (index: number) => {
    setProcedimentos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onBack}>Voltar</Button>
          <h2 className="text-lg font-semibold">Odontograma Completo – {patient.name}</h2>
        </div>
        {selectedTooth && (
          <Badge variant="outline" className="text-sm">Dente Selecionado: {selectedTooth}</Badge>
        )}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-[3] min-w-0 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <Odontograma
              value={dados}
              onChange={(next) => setDados(next)}
              onToothClick={handleToothClick}
              baseDir="/odontograma/base"
              teethDir="/odontograma/dentes"
              facesDir="/odontograma/faces"
              iconsDir="/odontograma/icones"
              height={680}
            />
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex-[2] min-w-[320px] max-w-[480px] bg-neutral-50 flex flex-col border-l">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-2">Procedimentos por Dente</h3>
            {selectedTooth ? (
              <div className="space-y-3">
                <Input value={descricao} placeholder="Descrição do procedimento" onChange={e => setDescricao(e.target.value)} />
                <Input value={valor} type="number" placeholder="Valor (opcional)" onChange={e => setValor(e.target.value)} />
                <Button onClick={handleAddProcedimento} disabled={!descricao.trim()}>Adicionar</Button>
              </div>
            ) : (
              <p className="text-sm text-neutral-600">Clique em um dente para adicionar procedimentos.</p>
            )}
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {procedimentos.length === 0 && <p className="text-sm text-neutral-500">Nenhum procedimento adicionado ainda.</p>}
              {procedimentos.map((p, idx) => (
                <Card key={idx} className="p-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Dente {p.toothId}</span>
                    <Badge variant="secondary" className="text-xs">{p.status}</Badge>
                  </div>
                  <p className="text-xs text-neutral-700 whitespace-pre-wrap">{p.descricao}</p>
                  {p.valor !== undefined && <p className="text-xs font-medium">R$ {p.valor.toFixed(2)}</p>}
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={() => removerProcedimento(idx)}>Remover</Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default FullOdontogramaPage;
