import { useRouter } from 'next/router';
import { useState, useMemo, useEffect } from 'react';
import deliveries, { updateDeliveries } from '@/data/deliveries';
import { getStorageDeliveries } from '@/utils/storage';

type Delivery = {
    id: number;
    date: string;
    salesOrder: string;
    generator: string;
    projectId: string;
    status: number;
};

export default function DeliveriesPage() {
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [deliveryData, setDeliveryData] = useState<Delivery[]>([]);
    const [searchId, setSearchId] = useState('');
    const [searchZvgp, setSearchZvgp] = useState('');
    const [searchGerador, setSearchGerador] = useState('');
    const [searchPep, setSearchPep] = useState('');

    useEffect(() => {
        const storedDeliveries = getStorageDeliveries() || deliveries;
        setDeliveryData(storedDeliveries);
        setIsHydrated(true);
    }, []);

    const filteredDeliveries = useMemo(() =>
        deliveryData.filter(d =>
            d.id.toString().includes(searchId) &&
            d.salesOrder.toLowerCase().includes(searchZvgp.toLowerCase()) &&
            d.generator.toLowerCase().includes(searchGerador.toLowerCase()) &&
            d.projectId.toLowerCase().includes(searchPep.toLowerCase())
        ),
        [deliveryData, searchId, searchZvgp, searchGerador, searchPep]);

    if (!isHydrated) {
        return <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="h-screen overflow-y-auto m-auto relative overflow-x-auto shadow-md rounded-lg">
            <h1 className="p-8 pb-0 text-2xl font-bold">Solicitações</h1>
            <div className="p-8 pt-0">
                {/* Adicionar solicitação */}
                <button
                    onClick={() => router.push('/deliveries/new')}
                    className="btn btn-primary mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    + Nova Solicitação
                </button>

                {/* Filtros */}
                <div className="border border-gray-200 rounded-md m-auto inline-flex w-full">
                    <div className="pb-4 bg-white w-1/5">
                        <label className="sr-only">Buscar ID</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="text"
                                id="searchId"
                                value={searchId}
                                onChange={e => setSearchId(e.target.value)}
                                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                                placeholder="Buscar ID" />
                        </div>
                    </div>

                    <div className="pb-4 bg-white w-1/5">
                    </div>

                    <div className="pb-4 bg-white w-1/5">
                        <label className="sr-only">Buscar ZVGP</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="text"
                                id="searchZvgp"
                                value={searchZvgp}
                                onChange={e => setSearchZvgp(e.target.value)}
                                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                                placeholder="Buscar ZVGP" />
                        </div>
                    </div>

                    <div className="pb-4 bg-white w-1/5">
                        <label className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="text"
                                id="searchGerador"
                                value={searchGerador}
                                onChange={e => setSearchGerador(e.target.value)}
                                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                                placeholder="Buscar Gerador" />
                        </div>
                    </div>

                    <div className="pb-4 bg-white w-1/5">
                        <label className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="text"
                                id="searchPep"
                                value={searchPep}
                                onChange={e => setSearchPep(e.target.value)}
                                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                                placeholder="Buscar PEP" />
                        </div>
                    </div>

                </div>

                {/* Tabela */}
                <table className="w-full text-sm table-auto border shadow-md border-gray-200">
                    <thead className="sticky top-0 text-xs uppercase bg-gray-200 z-10">
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Data de Separação</th>
                            <th className="px-4 py-2">ZVGP</th>
                            <th className="px-4 py-2">Gerador</th>
                            <th className="px-4 py-2">PEP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDeliveries.map((delivery) => (
                            <tr
                                key={delivery.id}
                                onClick={() => router.push(`/deliveries/${delivery.id}`)}
                                className="cursor-pointer border-b border-gray-200 bg-white hover:bg-gray-100"
                            >
                                <td className="text-center px-4 py-2">{delivery.id}</td>
                                <td className="text-center px-4 py-2">{delivery.date}</td>
                                <td className="text-center px-4 py-2">{delivery.salesOrder}</td>
                                <td className="text-center px-4 py-2">{delivery.generator}</td>
                                <td className="text-center px-4 py-2">{delivery.projectId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}