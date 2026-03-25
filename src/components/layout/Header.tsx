import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";

export default function Header() {
  const [empresa, setEmpresa] = useState<{
    nome: string;
    cnpj: string;
    email: string;
    plano: string;
  } | null>(null);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);

  useEffect(() => {
    // Buscar dados da empresa do usuário logado
    axios.get("/api/empresa/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        console.log("Empresa recebida:", res.data);
        setEmpresa(res.data);
      })
      .catch(err => console.error("Erro ao buscar empresa:", err));

    // Buscar notificações recentes
    // axios.get("/api/notificacoes", {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // })
    //   .then(res => {
    //     const dados = Array.isArray(res.data)
    //       ? res.data
    //       : (res.data.data ? res.data.data : []);
    //     setNotificacoes(dados);
    //   })
    //   .catch(err => console.error("Erro ao buscar notificações:", err));
  }, []);

  return (
    <header className="w-full bg-white border-b px-6 py-3 flex items-center justify-between">
      <div></div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <div className="relative">
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell size={20} />
            {notificacoes.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Dropdown de notificações */}
          {notificacoes.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
              {notificacoes.map(n => (
                <div key={n.id} className="px-4 py-2 text-sm hover:bg-gray-100">
                  {n.mensagem}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empresa */}
        {empresa && (
          <div className="flex items-center gap-3 border-l pl-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-gray-700">{empresa.nome}</p>
              <p className="text-gray-500 text-xs">CNPJ: {empresa.cnpj}</p>
              <p className="text-gray-500 text-xs">Plano: {empresa.plano}</p>
            </div>
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="w-9 h-9 rounded-full"
            />
          </div>
        )}

      </div>
    </header>
  );
}