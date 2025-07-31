import { useRouter } from 'next/router';
import { useState } from 'react';
import deliveries from '@/data/deliveries';

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
}

function InputField({ label, value, editable }: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1 text-gray-700">{label}</label>
      <input
        type="text"
        className="border border-gray-200 rounded b"
        value={value}
        disabled={!editable}
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

  const delivery = deliveries.find((d) => d.id === id);
  const [editable, setEditable] = useState(true);
  const [items, setItems] = useState(delivery?.items || []);
  const [step, setStep] = useState(delivery?.status);
  const handlePrev = () =>
    setStep((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setStep((prev) =>
      Math.min(prev + 1, status.length - 1)
    );

  if (!delivery) return <p className="text-red-500 font-bold">Resgitro não encontrado</p>;

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
        <InputField label="Data de Separação" value={delivery.date} editable={editable} />
        <InputField label="ZVGP" value={delivery.salesOrder} editable={editable} />
        <InputField label="Gerador" value={delivery.generator} editable={editable} />
        <InputField label="PEP" value={delivery.projectId} editable={editable} />
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Itens</h2>
      <table className="table-auto max-w-400px bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Item SAP</th>
            <th className="px-4 py-2 text-left">Descrição</th>
            <th className="px-4 py-2 text-center">Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2 text-center">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => setEditable((e) => !e)}
        disabled={step !== 0}
        className="mt-6 px-6 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {editable ? 'Salvar' : 'Editar'}
      </button>

    </div>
  );
}