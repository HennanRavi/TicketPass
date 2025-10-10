import FooterSimple from "@/components/layout/FooterSimple";

export default function SupportRequest() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 mx-auto w-full max-w-[1200px] px-6 lg:px-12 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Submeter um Pedido de Suporte
        </h1>

        <div className="mt-8 space-y-8">
          {/* Bloco: Solicitação de informação */}
          <section>
            <h2 className="text-slate-700 font-medium">Solicitação de informação</h2>

            <div className="mt-5 grid grid-cols-1 max-w-[720px] gap-6">
              {/* Você é participante ou organizador? */}
              <div>
                <label className="block text-slate-800 mb-2">
                  Você é participante ou organizador de um evento?
                </label>
                <select
                  className="w-full rounded-[6px] border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#006CBF]/30"
                  defaultValue=""
                >
                  <option value="" disabled>escolha uma opção</option>
                  <option value="participante">Participante</option>
                  <option value="organizador">Organizador</option>
                </select>
              </div>

              {/* Nome Completo */}
              <div>
                <label className="block text-slate-800 mb-2">Nome Completo</label>
                <input
                  type="text"
                  className="w-full rounded-[6px] border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#006CBF]/30"
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-slate-800 mb-2">E-mail</label>
                <input
                  type="email"
                  className="w-full rounded-[6px] border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#006CBF]/30"
                />
              </div>

              {/* Assunto */}
              <div>
                <label className="block text-slate-800 mb-2">Assunto</label>
                <input
                  type="text"
                  className="w-full rounded-[6px] border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#006CBF]/30"
                />
              </div>
            </div>
          </section>

          {/* Descrição */}
          <section className="max-w-[720px]">
            <label className="block text-slate-800 mb-2">Descrição</label>
            <textarea
              rows={3}
              className="w-full rounded-[6px] border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#006CBF]/30"
            />
          </section>

          {/* Informações Adicionais + Prioridade */}
          <section className="max-w-[720px] space-y-6">
            <div>
              <label className="block text-slate-800 mb-2">Informações Adicionais</label>
              <textarea
                rows={2}
                className="w-full rounded-[6px] border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#006CBF]/30"
              />
            </div>

            <div>
              <label className="block text-slate-800 mb-2">Prioridade</label>
              <select
                className="w-full rounded-[6px] border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#006CBF]/30"
                defaultValue=""
              >
                <option value="" disabled>preenchimento opcional</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Ações */}
            <div className="pt-2 flex items-center gap-4">
              <button className="rounded-[2px] px-6 py-2.5 font-semibold text-white bg-[#006CBF] hover:brightness-95 shadow-sm transition">
                Submeter
              </button>
              <button className="rounded-[2px] px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 transition">
                Rejeitar
              </button>
            </div>
          </section>
        </div>
      </main>

      <FooterSimple />
    </div>
  );
}
