// CAÇADOR DE SITES · extrator do Google Maps
// Roda dentro de uma página de busca do Google Maps (ex: /maps/search/clinica+odontologica+em+Natal+RN)
// 1) rola a lista pra carregar mais resultados
// 2) ignora anúncios patrocinados
// 3) abre a ficha de cada negócio e lê o link de "Website" real
// 4) classifica a presença digital e devolve JSON
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const MIN_AVALIACOES = 10;   // abaixo disso o negócio ainda é pequeno demais
  const ROLAGENS = 5;          // cada rolagem traz ~7 resultados

  const feed = document.querySelector('div[role="feed"]');
  if (!feed) return 'ERRO: abra uma página de busca do Google Maps primeiro';
  for (let i = 0; i < ROLAGENS; i++) { feed.scrollTop = feed.scrollHeight; await sleep(1500); }

  const vistos = new Set();
  const leads = [];
  for (const a of feed.querySelectorAll('div[role="article"]')) {
    const t = a.innerText;
    if (t.includes('Patrocinado')) continue;
    const link = a.querySelector('a.hfpxzc');
    const nome = link ? link.getAttribute('aria-label') : '';
    if (!nome || vistos.has(nome)) continue;
    vistos.add(nome);
    const m = t.match(/(\d,\d)\(([\d.]+)\)/);
    const av = m ? +m[2].replace('.', '') : 0;
    if (av < MIN_AVALIACOES) continue;
    leads.push({
      nome,
      nota: m ? +m[1].replace(',', '.') : 0,
      avaliacoes: av,
      categoria: (t.split('\n').find(l => l.includes(' · ')) || '').split(' · ')[0].trim(),
      telefone: (t.match(/\(\d{2}\) [\d -]{8,11}\d/) || [''])[0],
      maps: link.href.split('?')[0]
    });
  }

  // abre cada ficha e lê o site de verdade (a lista esconde o botão em várias categorias)
  for (const l of leads) {
    const link = [...document.querySelectorAll('a.hfpxzc')].find(x => x.getAttribute('aria-label') === l.nome);
    if (!link) continue;
    link.click(); await sleep(2500);
    const auth = document.querySelector('a[data-item-id="authority"]');
    const end = document.querySelector('button[data-item-id="address"]');
    l.site = auth ? auth.href : '';
    l.endereco = end ? end.getAttribute('aria-label').replace(/^Endereço:\s*/, '') : '';
  }

  // classifica a presença digital
  const REDES = /instagram\.com|facebook\.com|linktr\.ee|wa\.me|whatsapp|tiktok\.com/i;
  const DIRETORIOS = /telepesquisa|guiamais|apontador|doctoralia|trinks\.com|booksy|ifood|odoo\.com|wixsite|negocio\.site|business\.site|sites\.google|linkr|bio\.link/i;
  for (const l of leads) {
    if (!l.site) l.presenca = 'Sem site';
    else if (REDES.test(l.site)) l.presenca = 'Só rede social';
    else if (DIRETORIOS.test(l.site)) l.presenca = 'Página de terceiros';
    else l.presenca = 'Site próprio';
  }
  window.__cacada = leads;
  return JSON.stringify(leads);
})();
