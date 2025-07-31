import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import deliveries, { updateDeliveries } from '@/data/deliveries';
import { getStorageDeliveries } from '@/utils/storage';

const status = [
  'Em Preenchimento',         // step 0
  'Em Preparação',   // step 1
  'Separado',      // step 2
  'Aguardando Carregamento',       // step 3
  'Em Trânsito',       // step 4
  'Entregue'      // step 5
];

interface InputFieldProps {
  label: string;
  value: string;
  editable: boolean;
  onChange?: (value: string) => void;
}

function InputField({ label, value, editable, onChange }: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1 text-gray-700">{label}</label>
      <input
        type="text"
        className="border border-gray-200 rounded b"
        value={value}
        disabled={!editable}
        onChange={(e) => editable && onChange?.(e.target.value)}
      />
    </div>
  );
}

interface StatusFieldProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
}

function StatusField({ step, onPrev, onNext }: StatusFieldProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-white p-4 rounded shadow">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Status
        </label>
        <input
          type="text"
          className="input input-bordered w-64"
          value={status[step]}
          disabled
        />
      </div>
      <div className="space-x-2">
        <button
          onClick={onPrev}
          className="btn btn-primary mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={step === 0}
        >
          ◀ Devolver
        </button>
        <button
          onClick={onNext}
          className="btn btn-primary mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={step === status.length - 1}
        >
          Enviar ▶
        </button>
      </div>
    </div>
  );
}

export default function DeliveryForm() {
  const router = useRouter();
  const { id } = router.query;
  const [isHydrated, setIsHydrated] = useState(false);
  const isNew = id === 'new';

  interface DeliveryItem {
    id: string;
    description: string;
    quantity: string;
  }

  interface DeliveryData {
    id: string;
    date: string;
    salesOrder: string;
    generator: string;
    projectId: string;
    status: number;
    items: DeliveryItem[];
  }

  const [deliveryData, setDeliveryData] = useState<DeliveryData | null>(null);
  const [items, setItems] = useState<DeliveryItem[]>([]);
  const [step, setStep] = useState(0);
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    if (!id) return;

    const storedDeliveries = getStorageDeliveries() || deliveries;
    interface DeliveryItem {
      id: string;
      description: string;
      quantity: string;
    }

    interface DeliveryData {
      id: string;
      date: string;
      salesOrder: string;
      generator: string;
      projectId: string;
      status: number;
      items: DeliveryItem[];
    }

    const delivery: DeliveryData | undefined = isNew
      ? {
      id: String(storedDeliveries.length + 1),
      date: new Date().toLocaleDateString('pt-BR'),
      salesOrder: '',
      generator: '',
      projectId: '',
      status: 0,
      items: [],
      }
      : (storedDeliveries.find((d: DeliveryData) => d.id === id) as DeliveryData | undefined);

    setDeliveryData(delivery || null);
    setItems(delivery?.items || []);
    setStep(delivery?.status ?? 0);
    setEditable(delivery?.status === 0);
    setIsHydrated(true);
  }, [id, isNew]);

  if (!isHydrated) {
    return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  const handleSave = () => {
    const updatedDelivery = { ...deliveryData, items, status: step };
    const storedDeliveries = getStorageDeliveries() || deliveries;
    
    let newDeliveries;
    if (isNew) {
      newDeliveries = [...storedDeliveries, updatedDelivery];
    } else {
      newDeliveries = storedDeliveries.map((d: DeliveryData) => 
        d.id === id ? updatedDelivery : d
      );
    }
    
    updateDeliveries(newDeliveries);
    setEditable(false);
    if (isNew) {
      router.push('/deliveries');
    }
  };

  const handlePrev = () =>
    setStep((prev = 0) =>
      Math.max((prev ?? 0) - 1, 0));
  const handleNext = () =>
    setStep((prev = 0) =>
      Math.min((prev ?? 0) + 1, status.length - 1)
    );

  if (!deliveryData) return <p className="text-red-500 font-bold">Resgitro não encontrado</p>;

  const handlePaste = (e: React.ClipboardEvent<HTMLTableElement>) => {
    if (!editable) return;

    const pasted = e.clipboardData.getData('text');
    const rows = pasted
      .trim()
      .split('\n')
      .map((row) => row.split('\t'));

    const newItems = rows.map(([id, description, quantity]) => ({
      id: id?.trim() || '',
      description: description?.trim() || '',
      quantity: quantity?.trim() || '',
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  return (
    <div className="p-6 pl-20 pr-20 bg-gray-100 min-h-screen">
      <button
        onClick={() => router.push('/deliveries')}
        className="btn btn-primary mb-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        ← Retornar
      </button>

      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Detalhes da Solicitação - {id}</h1>

      <StatusField
        step={step}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
        <InputField
          label="Data de Separação"
          value={deliveryData.date}
          editable={editable}
          onChange={(val) => setDeliveryData({ ...deliveryData, date: val })}
        />
        <InputField
          label="ZVGP"
          value={deliveryData.salesOrder}
          editable={editable}
          onChange={(val) => setDeliveryData({ ...deliveryData, salesOrder: val })}
        />
        <InputField
          label="Gerador"
          value={deliveryData.generator}
          editable={editable}
          onChange={(val) => setDeliveryData({ ...deliveryData, generator: val })}
        />
        <InputField
          label="PEP"
          value={deliveryData.projectId}
          editable={editable}
          onChange={(val) => setDeliveryData({ ...deliveryData, projectId: val })}
        />
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Itens</h2>

      <table
        className="table-auto max-w-400px bg-white rounded shadow"
        onPaste={handlePaste}
      >
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Item SAP</th>
            <th className="px-4 py-2 text-left">Descrição</th>
            <th className="px-4 py-2 text-center">Quantidade</th>
            <th className="px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="input input-sm input-bordered w-full"
                  value={item.id}
                  disabled={!editable}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].id = e.target.value;
                    setItems(newItems);
                  }}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="input input-sm input-bordered w-full"
                  value={item.description}
                  disabled={!editable}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].description = e.target.value;
                    setItems(newItems);
                  }}
                />
              </td>
              <td className="px-4 py-2 text-center">
                <input
                  type="number"
                  className="input input-sm input-bordered text-center"
                  value={item.quantity}
                  disabled={!editable}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].quantity = e.target.value;
                    setItems(newItems);
                  }}
                />
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  disabled={!editable}
                  onClick={() => {
                    const newItems = items.filter((_, i) => i !== index);
                    setItems(newItems);
                  }}
                  className="btn btn-sm btn-error"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          {editable && (
            <tr>
              <td colSpan={4} className="px-4 py-2 text-center">
                <button
                  onClick={() =>
                    setItems([...items, { id: '', description: '', quantity: '' }])
                  }
                  className="btn btn-sm btn-success"
                >
                  + Adicionar Item
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        disabled={step !== 0}
        className="mt-6 px-6 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {editable ? 'Salvar' : 'Editar'}
      </button>

    </div>
  );
}