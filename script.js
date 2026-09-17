/* =========================================================
   Convite para Yasmin
   ========================================================= */
(function () {
  'use strict';

  /* =======================================================
     Configuração rápida
     ======================================================= */
  const CONFIG = {
    // Número que recebe as respostas (DDI 55 + DDD 11 + número).
    telefone: '5511948909000',

    // Clipe oficial no YouTube. Usado quando nao existe arquivo de audio
    // na pasta (e o caso do site publicado no GitHub Pages).
    youtubeId: 'dl0Dp_FRMo4',

    // A mensagem do convite. As linhas em branco viram parágrafos.
    convite:
      'eu poderia ter te chamado por mensagem, mas achei que você merecia algo mais bonito. Então escrevi isso aqui.\n\n' +
      'Queria passar uma noite com você. Sem pressa, sem celular na mesa, só a gente conversando até perder a hora.\n\n' +
      'E pra não ter erro, quem escolhe tudo é você: o dia, o lugar, até o que a gente vai beber.\n\n' +
      'Eu só preciso de um sim.'
  };

  const $ = (id) => document.getElementById(id);

  const gate      = $('gate');
  const gateBtn   = $('gateBtn');
  const gateMute  = $('gateMute');
  const stage     = $('stage');
  const envelope  = $('envelope');
  const seal      = $('seal');
  const hint      = $('hint');
  const letterWrap= $('letterWrap');
  const msg       = $('msg');
  const msgFim    = $('msgFim');
  const typed     = $('typed');
  const btnResp   = $('btnResponder');
  const form      = $('form');
  const campoComida = $('campoComida');
  const btnNo     = $('btnNo');
  const err       = $('err');
  const done      = $('done');
  const recap     = $('recap');
  const wpp       = $('wpp');
  const again     = $('again');
  const song      = $('song');
  const musicBtn  = $('musicToggle');
  const heartsBox = $('hearts');

  /* =======================================================
     Corações flutuando no fundo
     ======================================================= */
  const SIMBOLOS = ['♥', '❤', '✿', '❦'];

  function soltarCoracao() {
    const s = document.createElement('span');
    s.textContent = SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = (12 + Math.random() * 20) + 'px';
    s.style.opacity = 0.25 + Math.random() * 0.45;
    const dur = 9 + Math.random() * 9;
    s.style.animationDuration = dur + 's';
    heartsBox.appendChild(s);
    setTimeout(() => s.remove(), dur * 1000);
  }
  setInterval(soltarCoracao, 700);
  for (let i = 0; i < 8; i++) setTimeout(soltarCoracao, i * 240);

  /* =======================================================
     Música: arquivo local, com o YouTube como reserva
     ======================================================= */
  let modo = 'mp3';          // 'mp3' enquanto houver arquivo; senao 'youtube'
  let querSom = false;       // o visitante pediu musica?
  let fade = null;
  let ytPlayer = null;
  let ytPronto = false;

  // Nenhum dos arquivos de audio existe -> usa o YouTube.
  function semArquivo() {
    if (modo === 'youtube') return;
    modo = 'youtube';
    prepararYT();
  }

  song.addEventListener('error', semArquivo);

  // O <audio> comeca a carregar antes deste script rodar, entao o erro pode
  // ter acontecido antes do listener existir. NETWORK_NO_SOURCE (3) quer
  // dizer que o navegador ja tentou todos os <source> e nenhum serviu.
  if (song.networkState === 3) semArquivo();

  function prepararYT() {
    if (ytPlayer || !CONFIG.youtubeId) return;

    window.onYouTubeIframeAPIReady = function () {
      ytPlayer = new YT.Player('ytPlayer', {
        videoId: CONFIG.youtubeId,
        playerVars: {
          controls: 0, rel: 0, playsinline: 1, modestbranding: 1,
          loop: 1, playlist: CONFIG.youtubeId
        },
        events: {
          onReady: (e) => {
            ytPronto = true;
            e.target.setVolume(55);
            if (querSom) {
              e.target.playVideo();
              musicBtn.classList.remove('muted');
            }
          },
          onError: () => {
            musicBtn.classList.add('muted');
            musicBtn.title = 'nao consegui carregar a musica';
          }
        }
      });
    };

    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  function tocando() {
    if (modo === 'youtube') {
      return !!(ytPronto && ytPlayer && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === 1);
    }
    return !song.paused;
  }

  function tocar() {
    querSom = true;

    if (modo === 'youtube') {
      if (ytPronto && ytPlayer) {
        ytPlayer.playVideo();
        musicBtn.classList.remove('muted');
      } else {
        prepararYT();          // assim que ficar pronto ele toca sozinho
      }
      return;
    }

    song.volume = 0;
    const p = song.play();
    if (p && p.catch) p.catch(() => { musicBtn.classList.add('muted'); });

    let v = 0;                 // fade-in suave ate 55% do volume
    clearInterval(fade);
    fade = setInterval(() => {
      v += 0.02;
      if (v >= 0.55) { v = 0.55; clearInterval(fade); fade = null; }
      song.volume = v;
    }, 90);
    musicBtn.classList.remove('muted');
  }

  function parar() {
    querSom = false;
    clearInterval(fade);
    fade = null;

    if (modo === 'youtube') {
      if (ytPronto && ytPlayer) ytPlayer.pauseVideo();
    } else {
      song.pause();
    }
    musicBtn.classList.add('muted');
  }

  musicBtn.addEventListener('click', () => {
    if (tocando()) parar();
    else tocar();
  });

  /* =======================================================
     Tela 1 -> Tela 2
     ======================================================= */
  function abrirPortao(comSom) {
    if (comSom) tocar();
    else musicBtn.classList.add('muted');
    gate.classList.add('hide');
    setTimeout(() => { gate.style.display = 'none'; }, 950);
  }

  gateBtn.addEventListener('click', () => abrirPortao(true));
  gateMute.addEventListener('click', () => abrirPortao(false));

  /* =======================================================
     Tela 2 -> Tela 3 (abre o envelope)
     ======================================================= */
  let aberto = false;

  function abrirCarta() {
    if (aberto) return;
    aberto = true;

    hint.classList.add('off');
    envelope.classList.add('opening');
    for (let i = 0; i < 18; i++) setTimeout(soltarCoracao, i * 70);

    setTimeout(() => {
      stage.classList.add('gone');
      letterWrap.classList.add('show');
      window.scrollTo(0, 0);
      escreverConvite();
    }, 1500);
  }

  seal.addEventListener('click', abrirCarta);
  envelope.addEventListener('click', abrirCarta);

  /* =======================================================
     Etapa 1: a mensagem do convite (máquina de escrever)
     ======================================================= */
  function escreverConvite() {
    const txt = CONFIG.convite;
    let i = 0;
    typed.textContent = '';

    const t = setInterval(() => {
      typed.textContent += txt.charAt(i);
      i++;
      if (i >= txt.length) {
        clearInterval(t);
        terminarTexto();
      }
    }, 32);

    function terminarTexto() {
      typed.textContent = txt;
      typed.classList.add('typed-done');
      msgFim.classList.add('show');   // assinatura + botão "quero responder"
    }

    // tocar na carta pula a digitação
    typed.addEventListener('click', () => {
      if (i < txt.length) {
        clearInterval(t);
        i = txt.length;
        terminarTexto();
      }
    });
  }

  /* =======================================================
     Etapa 1 -> Etapa 2: abre o formulário
     ======================================================= */
  btnResp.addEventListener('click', () => {
    msg.classList.add('respondido');
    form.classList.add('show');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* =======================================================
     Data de hoje na carta + datas mínimas
     ======================================================= */
  const hoje = new Date();
  const MESES = ['janeiro','fevereiro','março','abril','maio','junho',
                 'julho','agosto','setembro','outubro','novembro','dezembro'];

  $('letterDate').textContent =
    hoje.getDate() + ' de ' + MESES[hoje.getMonth()] + ' de ' + hoje.getFullYear();

  // Data AAAA-MM-DD no fuso LOCAL.
  // (toISOString() converteria para UTC e, no Brasil, viraria o dia seguinte à noite.)
  function iso(d) {
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mes + '-' + dia;
  }

  const inputData = $('data');
  const inputDataAlt = $('dataAlt');
  inputData.min = iso(hoje);
  inputDataAlt.min = iso(hoje);
  inputData.value = iso(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2));

  /* =======================================================
     Tipo de comida: só aparece se fizer sentido
     ======================================================= */
  const LOCAIS_COM_COMIDA = ['Restaurante', 'Eu cozinho pra você'];

  form.querySelectorAll('input[name="local"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const mostra = LOCAIS_COM_COMIDA.indexOf(radio.value) !== -1;
      campoComida.classList.toggle('show', mostra);
      if (!mostra) {
        form.querySelectorAll('input[name="comida"]').forEach(i => { i.checked = false; });
      }
    });
  });

  /* =======================================================
     Slider da ansiedade
     ======================================================= */
  const ANSIEDADE = [
    'zero. tô de boa.',
    'quase nada',
    'tranquila',
    'levemente animada',
    'tô curiosa',
    'no meio termo',
    'já tô pensando na roupa',
    'contando os dias',
    'não vou dormir direito',
    'muito ansiosa!',
    'surtando (do bom)'
  ];
  const slider = $('ansiedade');
  const sliderTxt = $('ansiedadeTxt');

  function pintarSlider() {
    const n = +slider.value;
    sliderTxt.textContent = n + ' — ' + ANSIEDADE[n];
  }
  slider.addEventListener('input', pintarSlider);
  pintarSlider();

  /* =======================================================
     Botão "Não" que foge
     ======================================================= */
  const DESCULPAS = [
    'Não', 'tem certeza?', 'pensa de novo', 'sério mesmo?',
    'esse botão não funciona', 'para de tentar', 'tá quebrado',
    'última chance de dizer sim', 'só tem o outro botão'
  ];
  let fugas = 0;

  function fugir() {
    fugas++;
    btnNo.textContent = DESCULPAS[Math.min(fugas, DESCULPAS.length - 1)];

    const zona = btnNo.parentElement.getBoundingClientRect();
    const max = Math.max(40, zona.width / 2 - btnNo.offsetWidth / 2);
    const x = (Math.random() * 2 - 1) * max;
    const y = (Math.random() * 2 - 1) * 34;

    btnNo.style.position = 'relative';
    btnNo.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (Math.random() * 24 - 12) + 'deg)';

    if (fugas > 5) btnNo.style.opacity = Math.max(0.25, 1 - (fugas - 5) * 0.16);
  }

  btnNo.addEventListener('mouseenter', fugir);
  btnNo.addEventListener('click', fugir);
  btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); fugir(); }, { passive: false });

  /* =======================================================
     Validação + envio
     ======================================================= */
  function erro(texto) {
    err.textContent = texto;
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 3400);
  }

  function pegarRadio(nome) {
    const el = form.querySelector('input[name="' + nome + '"]:checked');
    return el ? el.value : null;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const r = {
      data:      inputData.value,
      hora:      $('hora').value,
      dataAlt:   inputDataAlt.value,
      local:     pegarRadio('local'),
      comida:    pegarRadio('comida'),
      bebida:    pegarRadio('bebida'),
      dress:     pegarRadio('dress'),
      chuva:     pegarRadio('chuva'),
      restricao: $('restricao').value.trim(),
      recado:    $('recado').value.trim(),
      ansiedade: +slider.value,
      extras:    Array.from(form.querySelectorAll('input[name="extra"]:checked')).map(i => i.value)
    };

    if (!r.data)   return erro('Escolhe um dia pra mim, vai...');
    if (!r.hora)   return erro('E que horas?');
    if (!r.local)  return erro('Falta escolher onde a gente vai.');
    if (campoComida.classList.contains('show') && !r.comida) {
      return erro('E o que você quer comer?');
    }
    if (!r.bebida) return erro('E pra beber, o que você quer?');

    mostrarFinal(r);
  });

  /* =======================================================
     Tela final
     ======================================================= */
  const DIAS = ['domingo','segunda-feira','terça-feira','quarta-feira',
                'quinta-feira','sexta-feira','sábado'];

  function dataBonita(txt) {
    const p = txt.split('-');
    const d = new Date(+p[0], +p[1] - 1, +p[2]);
    return DIAS[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()];
  }

  function montarLinhas(r) {
    const linhas = [
      ['Quando', dataBonita(r.data) + ' às ' + r.hora],
      ['Onde',   r.local]
    ];
    if (r.comida)        linhas.push(['Comida', r.comida]);
    linhas.push(['Bebida', r.bebida]);
    if (r.dress)         linhas.push(['Vou de', r.dress]);
    if (r.chuva)         linhas.push(['Se chover', r.chuva]);
    if (r.extras.length) linhas.push(['Extras', r.extras.join(', ')]);
    if (r.restricao)     linhas.push(['Não como', r.restricao]);
    if (r.dataAlt)       linhas.push(['Se não der', dataBonita(r.dataAlt)]);
    linhas.push(['Ansiedade', r.ansiedade + '/10 — ' + ANSIEDADE[r.ansiedade]]);
    if (r.recado)        linhas.push(['Recado', r.recado]);
    return linhas;
  }

  function mostrarFinal(r) {
    const linhas = montarLinhas(r);

    recap.innerHTML = '';
    linhas.forEach(([k, v], i) => {
      const li = document.createElement('li');
      const b = document.createElement('b');
      b.textContent = k + ':';
      li.appendChild(b);
      li.appendChild(document.createTextNode(' ' + v));
      li.style.animationDelay = (0.35 + i * 0.08) + 's';
      recap.appendChild(li);
    });

    // mensagem pronta para o WhatsApp
    let texto = 'Oi! Aceitei o convite ♥\n\n';
    linhas.forEach(([k, v]) => { texto += k + ': ' + v + '\n'; });
    wpp.href = 'https://wa.me/' + CONFIG.telefone + '?text=' + encodeURIComponent(texto);

    iniciarContagem(r.data, r.hora);

    done.classList.add('show');
    confete();
  }

  again.addEventListener('click', () => {
    done.classList.remove('show');
    pararConfete();
    pararContagem();
  });

  /* =======================================================
     Contagem regressiva até o encontro
     ======================================================= */
  let tick = null;

  function iniciarContagem(dataTxt, horaTxt) {
    pararContagem();

    const d = dataTxt.split('-');
    const h = horaTxt.split(':');
    const alvo = new Date(+d[0], +d[1] - 1, +d[2], +h[0] || 0, +h[1] || 0, 0);

    const caixa  = $('contagem');
    const titulo = caixa.querySelector('.contagem-tit');

    function atualizar() {
      const resta = alvo.getTime() - new Date().getTime();

      if (resta <= 0) {
        caixa.classList.add('chegou');
        titulo.textContent = 'chegou a hora ♥';
        pararContagem();
        return;
      }

      caixa.classList.remove('chegou');
      titulo.textContent = 'falta pouco';

      const seg = Math.floor(resta / 1000);
      $('cDias').textContent  = Math.floor(seg / 86400);
      $('cHoras').textContent = Math.floor(seg % 86400 / 3600);
      $('cMin').textContent   = Math.floor(seg % 3600 / 60);
      $('cSeg').textContent   = seg % 60;
    }

    atualizar();
    tick = setInterval(atualizar, 1000);
  }

  function pararContagem() {
    if (tick) clearInterval(tick);
    tick = null;
  }

  /* =======================================================
     Confete (canvas)
     ======================================================= */
  const cv = $('confetti');
  const ctx = cv.getContext('2d');
  const CORES = ['#d4272b', '#a8171a', '#f3e6cd', '#e0b352', '#ffffff', '#ff8fa3'];

  // Recicla as peças por ~3,5s e depois deixa a chuva acabar, para o
  // canvas não ficar animando para sempre (gasta bateria no celular).
  const FRAMES_RECICLANDO = 210;

  let pecas = [];
  let raf = null;
  let frames = 0;

  function ajustarCanvas() {
    cv.width = cv.offsetWidth;
    cv.height = cv.offsetHeight;
  }
  window.addEventListener('resize', ajustarCanvas);

  function confete() {
    ajustarCanvas();
    pecas = [];
    for (let i = 0; i < 150; i++) {
      pecas.push({
        x: Math.random() * cv.width,
        y: -20 - Math.random() * cv.height,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        cor: CORES[Math.floor(Math.random() * CORES.length)],
        vy: 1.4 + Math.random() * 3,
        vx: -1 + Math.random() * 2,
        rot: Math.random() * Math.PI * 2,
        vr: -0.12 + Math.random() * 0.24,
        coracao: Math.random() < 0.28
      });
    }
    frames = 0;
    if (raf) cancelAnimationFrame(raf);
    loop();
  }

  function loop() {
    frames++;
    ctx.clearRect(0, 0, cv.width, cv.height);

    let vivas = 0;
    pecas.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.y / 44) * 0.8;
      p.rot += p.vr;

      if (p.y > cv.height + 30) {
        if (frames < FRAMES_RECICLANDO) { p.y = -20; p.x = Math.random() * cv.width; }
        else return;                    // saiu de cena e não volta mais
      }
      vivas++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.cor;
      if (p.coracao) {
        ctx.font = p.w * 2 + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('♥', 0, 0);
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });

    if (vivas === 0) { pararConfete(); return; }
    raf = requestAnimationFrame(loop);
  }

  function pararConfete() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    ctx.clearRect(0, 0, cv.width, cv.height);
  }

  /* =======================================================
     Atalho: Enter/Espaço abre o envelope
     ======================================================= */
  document.addEventListener('keydown', (e) => {
    if (!aberto && gate.style.display === 'none' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      abrirCarta();
    }
  });
})();
