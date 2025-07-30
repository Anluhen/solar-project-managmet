import { useRouter } from 'next/router';
import deliveries from '@/data/deliveries';

export default function DeliveriesPage() {
    const router = useRouter();

    return (
        <div className="h-screen overflow-y-auto m-auto relative overflow-x-auto shadow-md rounded-lg">
            <h1 className="p-8 pb-0 text-2xl font-bold">Solicitações</h1>
            <div className="p-8 pt-0">
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
                        {deliveries.map((delivery) => (
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