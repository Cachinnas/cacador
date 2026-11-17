"""CAÇADOR DE SITES · algoritmo de pontuação (0 a 100)

Ideia central: o melhor cliente é o negócio que JÁ VAI BEM (muita avaliação, nota alta)
mas que NÃO TEM onde mandar o cliente (sem site, ou só Instagram / página de terceiros).
"""
import csv, json, sys

TICKET = {  # quanto o nicho costuma pagar e quanto um site muda o jogo pra ele
    "odonto": 10, "estetica": 10, "advocacia": 10, "arquitetura": 10, "clinica": 10,
    "salao": 7, "restaurante": 6, "confeitaria": 6, "pet": 6, "academia": 7, "outro": 5,
}

def presenca(p):
    return {"Sem site": 40, "Só rede social": 35, "Página de terceiros": 30, "Site próprio": 0}[p]

def tracao(av):
    for lim, pts in [(500, 25), (200, 21), (100, 17), (50, 13), (20, 8), (10, 4)]:
        if av >= lim:
            return pts
    return 0

def reputacao(nota):
    if nota >= 4.8: return 15
    if nota >= 4.5: return 11
    if nota >= 4.0: return 6
    return 0  # nota baixa: o problema dele não é site

def contato(tel):
    if not tel: return 0
    digitos = "".join(c for c in tel if c.isdigit())
    return 10 if len(digitos) == 11 and digitos[2] == "9" else 6  # celular = provável WhatsApp

def pontuar(l):
    pts = presenca(l["presenca"]) + tracao(l["avaliacoes"]) + reputacao(l["nota"]) \
        + TICKET.get(l["nicho"], 5) + contato(l["telefone"])
    if l["presenca"] == "Site próprio":
        faixa = "Descartado"
    elif l["nota"] < 4.0:
        faixa = "Frio"  # reputação ruim: site não resolve, e o cliente tende a culpar o site
    elif pts >= 80:
        faixa = "Quente"
    elif pts >= 65:
        faixa = "Morno"
    else:
        faixa = "Frio"
    return pts, faixa

def gancho(l):
    nota = str(l["nota"]).replace(".", ",")
    base = f"{l['avaliacoes']} avaliações com nota {nota} no Google"
    if l["presenca"] == "Sem site":
        return f"{base}, mas quem pesquisa vocês não encontra um site"
    if l["presenca"] == "Só rede social":
        return f"{base}, e hoje o Google manda essas pessoas só pro Instagram"
    return f"{base}, mas o link da ficha leva pra uma página genérica de terceiros"

if __name__ == "__main__":
    leads = json.load(open(sys.argv[1], encoding="utf-8"))
    for l in leads:
        l["pontos"], l["faixa"] = pontuar(l)
        l["gancho"] = gancho(l)
    leads.sort(key=lambda l: -l["pontos"])
    json.dump(leads, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for l in leads:
        print(f"{l['pontos']:>3} {l['faixa']:<10} {l['nome'][:38]:<38} {l['presenca']}")
