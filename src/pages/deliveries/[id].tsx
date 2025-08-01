import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import deliveries, { updateDeliveries } from '@/data/deliveries';
import { getStorageDeliveries } from '@/utils/storage';

import InfoForm from '@/components/InfoForm';
import StatusField from '@/components/StatusField';
import FreteForm from '@/components/FreteForm';
import ItemsTable from '@/components/ItemsTable';

const status = [
  'Em Preenchimento',         // step 0
  'Em Preparação',   // step 1
  'Separado',      // step 2
  'Aguardando Carregamento',       // step 3
  'Em Trânsito',       // step 4
  'Entregue'      // step 5
];

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
    messages: string[];
    items: DeliveryItem[];
  }

  const [deliveryData, setDeliveryData] = useState<DeliveryData | null>(null);
  const [items, setItems] = useState<DeliveryItem[]>([]);
  const [step, setStep] = useState(deliveryData?.status || 0);
  const [editable, setEditable] = useState(false);
  const [message, setMessage] = useState(deliveryData?.messages?.[step] || '')

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
      messages: string[];
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
        messages: [],
        items: [],
      }
      : (storedDeliveries.find((d: DeliveryData) => d.id === id) as DeliveryData | undefined);

    setDeliveryData(delivery || null);
    setItems(delivery?.items || []);
    setStep(delivery?.status ?? 0);
    setMessage(delivery?.messages?.[step] || '')
    setEditable(isNew);
    setIsHydrated(true);
  }, [id, isNew]);

  if (!isHydrated) {
    return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  const handleSave = () => {
    if (editable) {
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
    } else {
      setEditable(true);
    }
  };

  const handlePrev = () => {
    const userMsg = window.prompt('Por favor, explique o motivo da devolução:', message);

    if (userMsg !== '') {
      setMessage(userMsg ?? '');
    }

    setStep((prev = 0) =>
      Math.max((prev ?? 0) - 1, 0));
  }

  const handleNext = () => {
    setMessage(deliveryData?.messages?.[step + 1] || '');
    setStep((prev = 0) =>
      Math.min((prev ?? 0) + 1, status.length - 1)
    );
  }

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
      <div className="inline-flex justify-between w-full">
        <button
          onClick={() => router.push('/deliveries')}
          className="btn btn-primary mb-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          ← Retornar
        </button>

        <button
          onClick={handleSave}
          // disabled={step !== 0}
          className="btn btn-primary mb-6 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {editable ? 'Salvar' : 'Editar'}
        </button>
      </div>
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Detalhes da Solicitação - {id}</h1>

      <StatusField
        step={step}
        status={status}
        onPrev={handlePrev}
        onNext={handleNext}
        message={message}
        setMessage={setMessage}
        editable={editable}
      />

      <InfoForm
        deliveryData={deliveryData}
        setDeliveryData={setDeliveryData}
        editable={editable && step === 0}
      />

      <h2 className="text-xl font-bold mt-6 mb-4">Itens</h2>

      <ItemsTable
        items={items}
        setItems={setItems}
        editable={editable && step === 0}
        handlePaste={handlePaste}
      />

      <FreteForm
        editable={editable && step === 2}
        hidden={step !== 2}
      />

    </div>
  );
}