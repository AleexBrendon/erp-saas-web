import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import SalesList from "../../components/vendas/SalesList";
import VendasModal, { type VendaFormData } from "../../components/vendas/SalesModal";
import { getClientes } from "../../storage/clientStorage";
import {
  getVendas,
  createVenda,
  updateVenda,
  deleteVenda,
  type VendaItemAPI,
} from "../../storage/salesStorage";

export default function VendasPage() {
  const [vendas, setVendas] = useState<VendaItemAPI[]>([]);
  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<VendaItemAPI | null>(null);

  const loadAll = async () => {
    const data = await getVendas();
    setVendas(data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const loadClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };
    loadClientes();
  }, []);

  const save = async (data: VendaFormData) => {
    const payload = {
      cliente_id: data.cliente_id,
      total: data.total,
      status: data.status,
    };

    if (editData?.id) {
      await updateVenda(editData.id, payload);
    } else {
      await createVenda(payload);
    }

    await loadAll();
    setModalOpen(false);
    setEditData(null);
  };

  const remove = async (id: number) => {
    await deleteVenda(id);
    setVendas((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-[20px]">
        <h1 className="text-title font-bold mb-[20px] ml-[30px] text-colortitle">
          Vendas
        </h1>
        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="bg-[#5C67FF] hover:bg-[#4a54e1] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2 mb-[20px]"
        >
          <Plus size={18} />
          Nova Venda
        </button>
      </div>

      <div className="bg-[#F8F9FD] min-h-screen border-separate border-spacing-y-[10px] rounded-[10px] border-slate-100 p-[20px]">

        <div className="bg-white rounded-[5px] border shadow p-[20px]">
          <SalesList
            items={vendas}
            onEdit={(item) => {
              setEditData(item);
              setModalOpen(true);
            }}
            onDelete={remove}
          />
        </div>

        {modalOpen && (
          <VendasModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={save}
            editData={editData}
            clientes={clientes}
          />
        )}
      </div>
    </div>
  );
}