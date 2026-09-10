import { useState } from "react";
import { Search, AlertTriangle, Plus, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { scamReports } from "../data/scams";

export function Community() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = scamReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-[430px] mx-auto">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl text-foreground">Comunidade</h1>
            <button
              onClick={() => navigate("/report")}
              className="w-12 h-12 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar golpes, categorias..."
              className="w-full h-12 pl-12 pr-4 bg-input-background border border-input focus:border-accent rounded-xl outline-none transition-colors"
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {filteredReports.length}{" "}
              {searchQuery
                ? "resultados encontrados"
                : "alertas ativos na comunidade"}
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                Nenhum golpe encontrado para "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => navigate(`/community/${report.id}`)}
                  className="w-full text-left bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-accent/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-foreground mb-2"
                        style={{ overflowWrap: "break-word", wordBreak: "break-word", lineHeight: 1.4 }}
                      >
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span>{report.time}</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-destructive rounded-full" aria-hidden="true"></span>
                          {report.reports} Reports
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted" style={{ overflowWrap: "break-word" }}>
                          {report.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
