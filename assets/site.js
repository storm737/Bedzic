// Bedžić — deljeni JS za sve strane sajta. Svaki blok proverava da li njegovi
// elementi postoje na trenutnoj strani pre nego što nastavi (npr. konfigurator
// radi samo na napravi.html, modal za porudžbinu samo na gotovi.html).
(function () {
  "use strict";

  /* ====== Menja se kad stignu podaci ====== */
  var INSTAGRAM = "https://www.instagram.com/bedzic/";
  var WHATSAPP_BROJ = ""; // npr. "381601234567" — tada se pojavi i WhatsApp dugme

  /* Mejl radionice — ovde stižu sve porudžbine i upiti sa sajta. */
  var EMAIL = "bedzic@gmail.com";

  /* ⬇⬇ OVDE UPIŠI KLJUČ SA web3forms.com (besplatan, vezuje se za EMAIL gore).
     Dok je prazno, porudžbina se ne gubi — otvara se mejl program kupca sa
     već popunjenom porukom na EMAIL, pa je dovoljno da pritisne „Pošalji". ⬇⬇ */
  var WEB3FORMS_KLJUC = "c395cbe4-59b3-4eb1-80bf-fd1caafb7516";

  /* Šolja na naslovnoj lista njene prave dizajne — svaki ima svoje pismo,
     svoju boju i svoj odnos veličina redova, kao na fotografijama. */
  var ORIGINALI = [
    { tekst: "Pij tu kafu\ni ne seri",              slova: "kontura", boja: "#EA6E9C", mere: ["srednje", "srednje"] },
    { tekst: "Ništa\njela nisam\nmoja Slavice",     slova: "debela",  boja: "#C93F55", mere: ["veliko", "malo", "srednje"] },
    { tekst: "Kafa je pola\nmentalnog\nzdravlja",   slova: "marker",  boja: "#D9548A", mere: ["srednje", "srednje", "srednje"] },
    { tekst: "A šta misliš\nhoće mi se javiti?",    slova: "strip",   boja: "#241820", mere: ["srednje", "srednje"] },
    { tekst: "Dobro.",                              slova: "marker",  boja: "#EA6E9C", mere: ["veliko"] },
    { tekst: "Kraći\nbez mleka",                    slova: "masina",  boja: "#241820", mere: ["srednje", "srednje"] },
    { tekst: "Stala nisam\nmoja Slavice",           slova: "debela",  boja: "#3A5DA8", mere: ["malo", "veliko"] },
    { tekst: "A pola je rakija\nmoja Slavice",      slova: "marker",  boja: "#7E8C4A", mere: ["srednje", "srednje"] }
  ];

  var RECENICE = ORIGINALI.map(function (o) { return o.tekst; });

  var SLOVA = [
    { id: "debela",    ime: "Debela",    pod: "puna i okrugla",      uzorak: "Dobro." },
    { id: "marker",    ime: "Marker",    pod: "kao pisano rukom",    uzorak: "Dobro." },
    { id: "strip",     ime: "Strip",     pod: "visoka i zbijena",    uzorak: "Dobro." },
    { id: "kontura",   ime: "Kontura",   pod: "sa obrubom",          uzorak: "Dobro." },
    { id: "masina",    ime: "Mašina",    pod: "sitna, razmaknuta",   uzorak: "Dobro" },
    { id: "elegantna", ime: "Elegantna", pod: "tanka, velika slova", uzorak: "Dobro." },
    { id: "okrugla",   ime: "Okrugla",   pod: "meka i prijateljska", uzorak: "Dobro." }
  ];

  var BOJE_SLOVA = [
    { id: "crna",    ime: "Crna",              hex: "#241820" },
    { id: "crvena",  ime: "Trešnja crvena",    hex: "#C1495A" },
    { id: "roza",    ime: "Roza",              hex: "#E37FA3" },
    { id: "maslina", ime: "Maslinasto zelena", hex: "#7E8C4A" },
    { id: "plava",   ime: "Plava",             hex: "#3A5DA8" },
    { id: "lila",    ime: "Lila",              hex: "#8B72C9" }
  ];

  /* koliko se svaki red uvećava u odnosu na osnovnu veličinu slova */
  var MERE = [
    { id: "malo",    ime: "Sitno",   skala: 0.62 },
    { id: "srednje", ime: "Srednje", skala: 1 },
    { id: "veliko",  ime: "Krupno",  skala: 1.34 }
  ];

  var CENE = { jedna: 1100, dve: 2200 };

  /* Konfigurator ume da napravi dva proizvoda na istoj šemi (isti natpis/slika
     okvir, ista forma). Šoljica ima cenu po količini (par je komplet),
     tumbler ima jedinstvenu cenu po komadu. */
  var PROIZVODI = [
    { id: "solja",   ime: "Šoljica", foto: "assets/solja-bela.png?v=5",       fotoAlt: "Pregled tvoje šoljice", fotoW: 1307, fotoH: 893,  zapremina: true },
    { id: "flasica", ime: "Tumbler", foto: "assets/tumbler-pregled.png?v=1", fotoAlt: "Pregled tvog tumblera", fotoW: 435, fotoH: 1228, zapremina: false, ml: 590, cena: 1900 },
    { id: "limenka", ime: "Limenka", foto: "assets/limenka-pregled.png?v=1", fotoAlt: "Pregled tvoje limenke", fotoW: 584, fotoH: 1120, zapremina: false, ml: 350, cena: 1000 },
    { id: "pluta",   ime: "Šoljica sa poklopcem", foto: "assets/pluta-pregled.png?v=1", fotoAlt: "Pregled tvoje šoljice sa poklopcem i plutanom osnovom", fotoW: 904, fotoH: 1019, zapremina: false, ml: 400, cena: 1300 },
    { id: "boca",    ime: "Sportska flašica", foto: "assets/flasica2-pregled.png?v=1", fotoAlt: "Pregled tvoje sportske flašice", fotoW: 425, fotoH: 1232, zapremina: false, ml: 600, cena: 1000 }
  ];
  var NACINI = [
    { id: "tekst", ime: "Dodaj tekst" },
    { id: "slika", ime: "Dodaj sliku" }
  ];

  var stanje = {
    proizvod: "solja", proizvodIzabran: false, nacin: "tekst",
    tekst: "", slova: "debela", bojaSlova: "crvena", velicina: "200", kolicina: 1,
    mereRedova: ["srednje", "srednje", "srednje"],
    slika: null /* { dataUrl, ime } kad korisnik pošalje svoju sliku */
  };

  var $ = function (id) { return document.getElementById(id); };
  var mirnije = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function nadji(niz, id) {
    for (var i = 0; i < niz.length; i++) { if (niz[i].id === id) return niz[i]; }
    return niz[0];
  }
  function dinari(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " din"; }
  function redovi(t) {
    return String(t).split("\n").map(function (r) { return r.trim(); })
      .filter(function (r) { return r.length; }).slice(0, 3);
  }
  /* pretvara data: URL (slika koju je korisnik poslao) u Blob, za slanje kao
     prilog kad je WEB3FORMS_KLJUC upisan — mailto ne ume da nosi priloge */
  function dataUrlUBlob(dataUrl) {
    var deo = dataUrl.split(",");
    var mime = (deo[0].match(/:(.*?);/) || [])[1] || "image/jpeg";
    var bin = atob(deo[1]);
    var niz = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) niz[i] = bin.charCodeAt(i);
    return new Blob([niz], { type: mime });
  }

  /* tamnija nijansa za obrub kod stila "kontura" */
  function potamni(hex, koliko) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.round(((n >> 16) & 255) * koliko);
    var g = Math.round(((n >> 8) & 255) * koliko);
    var b = Math.round((n & 255) * koliko);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function ispisi(el, tekst, slova, boja, prazanTekst, mere) {
    var linije = redovi(tekst);
    var prazno = linije.length === 0;
    if (prazno && prazanTekst) linije = [prazanTekst];

    el.dataset.slova = slova;
    el.style.color = boja;
    el.style.setProperty("--kontura", potamni(boja.charAt(0) === "#" ? boja : "#C1495A", 0.55));
    el.classList.toggle("natpis--prazan", prazno && !!prazanTekst);

    var unutra = el.querySelector(".natpis__unutra");
    unutra.textContent = "";
    linije.forEach(function (linija, i) {
      var red = document.createElement("span");
      red.className = "natpis__red";
      red.textContent = linija;
      if (mere && !prazno) {
        red.style.setProperty("--skala", nadji(MERE, mere[i] || "srednje").skala);
      }
      unutra.appendChild(red);
    });
  }

  /* ====== Naslovna: rečenice se smenjuju ======
     Naslovna više ne nosi šolju sa živim natpisom — ovo radi samo ako je ima. */
  var naslovnaNatpis = $("naslovnaNatpis");
  if (naslovnaNatpis) {
    var indeks = 0;
    var naslovnaPrikazi = function () {
      var o = ORIGINALI[indeks];
      ispisi(naslovnaNatpis, o.tekst, o.slova, o.boja, null, o.mere);
      if (!mirnije) {
        naslovnaNatpis.classList.remove("natpis--smena");
        void naslovnaNatpis.offsetWidth;
        naslovnaNatpis.classList.add("natpis--smena");
      }
    };
    naslovnaPrikazi();
    if (!mirnije) {
      setInterval(function () {
        indeks = (indeks + 1) % ORIGINALI.length;
        naslovnaPrikazi();
      }, 4200);
    }
  }

  /* ====== Hamburger meni u zaglavlju (samo uski ekran) ====== */
  (function () {
    var prekidac = document.querySelector(".nav__prekidac");
    var linkovi = document.querySelector(".nav__linkovi");
    if (!prekidac || !linkovi) return;

    function zatvori() {
      linkovi.removeAttribute("data-otvoreno");
      prekidac.setAttribute("aria-expanded", "false");
    }
    function otvoreno() { return linkovi.getAttribute("data-otvoreno") === "true"; }
    function otvoriZatvori() {
      if (otvoreno()) { zatvori(); return; }
      linkovi.setAttribute("data-otvoreno", "true");
      prekidac.setAttribute("aria-expanded", "true");
    }

    prekidac.addEventListener("click", otvoriZatvori);
    /* klik na bilo koji link zatvara meni — i kad vodi na istu stranu (#vrh) */
    Array.prototype.forEach.call(linkovi.querySelectorAll("a"), function (a) {
      a.addEventListener("click", zatvori);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && otvoreno()) zatvori();
    });
    /* klik van menija ga zatvara */
    document.addEventListener("click", function (e) {
      if (otvoreno() && !linkovi.contains(e.target) && e.target !== prekidac && !prekidac.contains(e.target)) {
        zatvori();
      }
    });
    /* ako se ekran proširi preko praga dok je meni otvoren na telefonu */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) zatvori();
    });
  })();

  /* ====== Trešnje koje padaju preko naslovne ====== */
  (function () {
    var sloj = $("padaSloj");
    var naslovna = document.querySelector(".naslovna");
    if (!sloj || !naslovna || mirnije) return;

    /* Tačno 8 trešanja, raspoređenih preko cele širine ekrana.
       levo % | veličina px | trajanje s | kašnjenje s | zanos px | obrt deg */
    var KAPI = [
      [  5, 58, 22.0,  -3.0,  34,  240],
      [ 17, 50, 25.0,  -9.0, -28, -200],
      [ 29, 66, 20.0,  -1.5,  38, -270],
      [ 41, 52, 24.0, -13.0, -24,  220],
      [ 53, 72, 21.0,  -6.5, -36,  260],
      [ 65, 54, 23.5, -16.0,  30, -230],
      [ 78, 62, 19.5, -11.0, -32,  250],
      [ 90, 56, 26.0,  -4.5,  26, -210]
    ];

    KAPI.forEach(function (k) {
      var d = document.createElement("div");
      d.className = "pada";
      d.style.left = k[0] + "%";
      /* veličina ide kao --v, ne kao width — tako CSS može da je smanji na
         telefonu (inline width se ne bi mogao pregaziti bez !important) */
      d.style.setProperty("--v", k[1] + "px");
      d.style.animationDuration = k[2] + "s";
      d.style.animationDelay = k[3] + "s";
      d.style.setProperty("--zanos", k[4] + "px");
      d.style.setProperty("--obrt", k[5] + "deg");
      d.innerHTML = '<svg viewBox="0 0 100 100"><use href="#tresnja"/></svg>';
      sloj.appendChild(d);
    });

    /* koliko daleko padaju — do dna naslovne, pa još malo */
    function dubina() {
      sloj.style.setProperty("--pad", (naslovna.offsetHeight + 180) + "px");
    }
    dubina();
    var tajmer;
    window.addEventListener("resize", function () {
      clearTimeout(tajmer);
      tajmer = setTimeout(dubina, 200);
    });
  })();

  /* ====== Traka ====== */
  (function () {
    var staza = $("trakaStaza");
    if (!staza) return;
    var jedan = document.createDocumentFragment();
    RECENICE.forEach(function (r) {
      var s = document.createElement("span");
      s.className = "traka__stavka";
      s.innerHTML = '<svg viewBox="0 0 100 100"><use href="#tresnja"/></svg><span>' + r.replace(/\n/g, " ") + "</span>";
      jedan.appendChild(s);
    });
    staza.appendChild(jedan.cloneNode(true));
    staza.appendChild(jedan);
  })();

  /* Jedno mesto za kopiranje — koriste ga i konfigurator (napravi.html) i
     porudžbina gotovih proizvoda (gotovi.html), zato je ovde, van oba bloka. */
  function kopiraj(tekst, elPotvrda) {
    function javi(poruka) { elPotvrda.hidden = false; elPotvrda.textContent = poruka; }
    function uspeh() { javi("Kopirano — pošalji na " + EMAIL + " ili na Instagram"); }
    function rezerva() {
      var pom = document.createElement("textarea");
      pom.value = tekst; pom.setAttribute("readonly", "");
      pom.style.position = "fixed"; pom.style.opacity = "0";
      document.body.appendChild(pom); pom.select();
      try { document.execCommand("copy"); uspeh(); }
      catch (e) { javi("Kopiranje nije uspelo — označi tekst ručno."); }
      document.body.removeChild(pom);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tekst).then(uspeh, rezerva);
    } else { rezerva(); }
  }

  /* Isti modal za porudžbinu (forma + slanje mejlom + zahvalnica) koriste i
     katalog gotovih proizvoda (gotovi.html) i konfigurator (napravi.html) —
     zato su otvoriModal/zatvoriModal ovde, van oba bloka, kao i kopiraj(). */
  var modal = $("modal"), forma = $("forma"), hvala = $("hvala");
  var aktivnaInfo = null, poslednjiFokus = null;

  function zatvoriModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (poslednjiFokus) poslednjiFokus.focus();
  }

  /* Vatromet trešnjica — prsne preko zahvalnice kad porudžbina prođe.
     Sloj se sam ukloni kad animacija istekne, da ne ostaje u DOM-u. */
  function vatromet(domacin) {
    if (!domacin || mirnije) return;
    var sloj = document.createElement("div");
    sloj.className = "vatromet";
    sloj.setAttribute("aria-hidden", "true");

    /* izvorište praska — sredina zahvalnice, u koordinatama ekrana, jer sloj
       stoji fiksno preko cele strane (van prozora koji seče overflow-om) */
    var r = domacin.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height * 0.38;

    var KOMADA = 26, najduze = 0;
    for (var i = 0; i < KOMADA; i++) {
      var ugao = (Math.PI * 2 * i) / KOMADA + (Math.random() - 0.5) * 0.35;
      var domet = 90 + Math.random() * 150;
      var traj = 950 + Math.random() * 700;
      var kasni = Math.random() * 260;
      if (traj + kasni > najduze) najduze = traj + kasni;

      var k = document.createElement("i");
      k.style.setProperty("--x", cx + "px");
      k.style.setProperty("--y", cy + "px");
      k.style.setProperty("--dx", Math.cos(ugao) * domet + "px");
      /* malo naviše na startu pa niže — deluje kao da ih gravitacija povuče */
      k.style.setProperty("--dy", (Math.sin(ugao) * domet + 40) + "px");
      k.style.setProperty("--obrt", Math.round((Math.random() - 0.5) * 720) + "deg");
      k.style.setProperty("--v", (14 + Math.random() * 16).toFixed(0) + "px");
      k.style.setProperty("--traj", Math.round(traj) + "ms");
      k.style.setProperty("--kasni", Math.round(kasni) + "ms");
      k.innerHTML = '<svg viewBox="0 0 100 100"><use href="#tresnja"/></svg>';
      sloj.appendChild(k);
    }

    document.body.appendChild(sloj);
    setTimeout(function () {
      if (sloj.parentNode) sloj.parentNode.removeChild(sloj);
    }, najduze + 400);
  }

  /* info: {ime, cena, detalj, upit, zapremina, slika, slikaAlt, pregledEl,
            varijanteGrupe:[{ime, opcije[]}], unosLabel, opisDodatak[]} */
  /* Lično preuzimanje ne treba adresu — sakrij grad/poštu/adresu i skini
     im required, ostaje samo ime i telefon (dogovaramo se pozivom). */
  function sinhronizujPreuzimanje() {
    var izabran = forma.querySelector('[name="dostava"]:checked');
    var licno = !izabran || izabran.value.indexOf("Lično") === 0;
    Array.prototype.forEach.call(forma.querySelectorAll(".polja__adresno"), function (polje) {
      polje.hidden = licno;
      var unos = polje.querySelector("input");
      if (unos) unos.required = !licno;
    });
    var napomena = $("modalNapomenaLicno");
    if (napomena) napomena.hidden = !licno;
  }
  Array.prototype.forEach.call(forma.querySelectorAll('[name="dostava"]'), function (r) {
    r.addEventListener("change", sinhronizujPreuzimanje);
  });

  function otvoriModal(info, dugme) {
    aktivnaInfo = info;
    poslednjiFokus = dugme;
    forma.hidden = false;
    hvala.hidden = true;
    forma.reset();
    sinhronizujPreuzimanje();
    $("modalGreska").hidden = true;
    $("modalInfo").hidden = true;
    $("modalPosalji").disabled = false;
    /* sliku koju je kupac već priložio u konfiguratoru prenosimo ovde — ne mora
       da je bira drugi put, a polje prestaje da bude obavezno jer je slika tu */
    var vecPrilozena = info.korisnickaSlika;
    var slikaUnosEl = $("modalSlikaUnos"), slikaMiniEl = $("modalSlikaMini");
    if ($("modalSlikaIme")) {
      $("modalSlikaIme").textContent = vecPrilozena
        ? (vecPrilozena.ime || "slika.jpg")
        : "Nijedna slika nije izabrana";
    }
    if (slikaMiniEl) {
      slikaMiniEl.hidden = !vecPrilozena;
      if (vecPrilozena) slikaMiniEl.src = vecPrilozena.dataUrl;
    }
    if (slikaUnosEl) slikaUnosEl.required = !vecPrilozena;

    /* izbor 150/200 ml — samo za šoljice, one sve idu sa tacnom */
    var grupaZ = $("grupaZapremina");
    if (grupaZ) grupaZ.hidden = !info.zapremina;

    $("modalOznaka").textContent = info.upit ? "Upit radionici" : "Porudžbina";
    $("modalIme").textContent = info.ime;
    $("modalCena").textContent = info.cena + (info.upit ? "" : " + 600 din dostava");
    $("modalSpec").textContent = info.detalj || "";
    $("modalPosalji").textContent = info.upit ? "Pošalji upit" : "Pošalji porudžbinu";

    /* slika šoljice koja se poručuje — fotografija proizvoda iz kataloga, ili
       klon živog pregleda iz konfiguratora (sa natpisom, slovima i bojom) */
    var slikaWrap = $("modalSlikaWrap"), slikaImg = $("modalSlika");
    if (slikaWrap && slikaImg) {
      var stariKlon = slikaWrap.querySelector(".modal__pregled");
      if (stariKlon) slikaWrap.removeChild(stariKlon);

      if (info.pregledEl) {
        slikaImg.hidden = true;
        var klon = info.pregledEl.cloneNode(true);
        klon.className = "modal__pregled";
        /* id-jevi se ne smeju duplirati — klon je samo slika, ne kontrola */
        klon.removeAttribute("id");
        Array.prototype.forEach.call(klon.querySelectorAll("[id]"), function (e) {
          e.removeAttribute("id");
        });
        slikaWrap.appendChild(klon);
        slikaWrap.hidden = false;
      } else if (info.slika) {
        slikaImg.hidden = false;
        slikaImg.src = info.slika;
        slikaImg.alt = info.slikaAlt || "";
        slikaWrap.hidden = false;
      } else {
        slikaWrap.hidden = true;
      }
    }

    /* Izbori varijante — boja slova, dezen, figura, boja kućišta…
       Proizvod može da ima VIŠE grupa izbora (npr. peratonica bira i figuru
       i boju), pa se svaka renderuje kao zasebna grupa. Ime grupe pamtimo na
       samom elementu, da sastaviPorudzbinu zna kako da je nazove u poruci. */
    var kutija = $("modalVarijante");
    kutija.textContent = "";
    (info.varijanteGrupe || []).forEach(function (g) {
      if (!g || !g.opcije || !g.opcije.length) return;
      var grupa = document.createElement("div");
      grupa.className = "grupa";
      grupa.dataset.ime = g.ime || "Izaberi";
      grupa.innerHTML = '<p class="grupa__ime">' + (g.ime || "Izaberi") + ' <span class="obavezno" aria-label="obavezno" title="obavezno">*</span></p>';
      var red = document.createElement("div");
      red.className = "prekidac";
      red.setAttribute("role", "group");
      g.opcije.forEach(function (v, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "prekidac__dugme";
        b.textContent = v;
        b.setAttribute("aria-pressed", String(i === 0));
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(red.children, function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
        });
        red.appendChild(b);
      });
      grupa.appendChild(red);
      kutija.appendChild(grupa);
    });
    if (info.unosLabel) {
      var g2 = document.createElement("div");
      g2.className = "grupa";
      g2.innerHTML = '<p class="grupa__ime">' + info.unosLabel + ' <span class="obavezno" aria-label="obavezno" title="obavezno">*</span></p>' +
        '<input class="polje" name="unos" style="width:100%;font-size:16px;font-weight:600;padding:12px 15px;' +
        'border:1.5px solid var(--ivica);border-radius:16px;background:var(--krem)" maxlength="30" />';
      kutija.appendChild(g2);
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var prvo = modal.querySelector("input, button:not([data-zatvori])");
    if (prvo) prvo.focus();
  }

  /* ====== Kontrole ======
     Sve ovo postoji samo na strani sa konfiguratorom (napravi.html) — na
     ostalim stranama #tekst ne postoji, pa ceo blok bezbedno preskačemo. */
  var polje = $("tekst");
  if (polje) {

  var scenaProizvod = $("scenaProizvod"), proizvodFoto = $("proizvodFoto");
  var pregledSlikaEl = $("pregledSlika"), pregledSlikaImg = $("pregledSlikaImg");
  var pregledSlikaTrake = $("pregledSlikaTrake");
  if (pregledSlikaImg) pregledSlikaImg.addEventListener("load", function () { osveziTrake(); });
  var grupaTekst = $("grupaTekst"), grupaSlika = $("grupaSlika");
  var slikaGreska = $("slikaGreska"), slikaIme = $("slikaIme"), slikaUkloni = $("slikaUkloni");
  var konfigRed = $("konfigRed");

  napraviPrekidacRucno($("izborNacin"), NACINI, "nacin");
  /* izbor načina personalizacije — jedina preostala grupa koja radi sa
     {ime, vrednost} parovima kao i napraviPrekidac(), samo preko .id */
  function napraviPrekidacRucno(kontejner, spisak, kljuc) {
    if (!kontejner) return;
    spisak.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "prekidac__dugme"; b.textContent = o.ime;
      b.setAttribute("aria-pressed", String(stanje[kljuc] === o.id));
      b.addEventListener("click", function () { stanje[kljuc] = o.id; osvezi(); });
      kontejner.appendChild(b);
    });
  }

  /* Prvi korak — velike kartice (isti .tile kao na naslovnoj) umesto malih
     dugmića, i ceo ostatak konfiguratora je sakriven dok se nešto ne izabere.
     Tako korisnik prvo vidi samo pitanje „šoljica ili flašica", ne sve odjednom. */
  Array.prototype.forEach.call(document.querySelectorAll("#izborProizvod .tile"), function (kartica) {
    kartica.addEventListener("click", function () {
      stanje.proizvod = kartica.dataset.id;
      stanje.proizvodIzabran = true;
      osvezi();
      konfigRed.scrollIntoView({ block: "start", behavior: mirnije ? "auto" : "smooth" });
    });
  });

  function ucitajSliku(file, posle) {
    slikaGreska.hidden = true;
    if (!/^image\//.test(file.type)) {
      slikaGreska.hidden = false;
      slikaGreska.textContent = "Ovo nije slika — izaberi JPG, PNG ili sličan format.";
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      slikaGreska.hidden = false;
      slikaGreska.textContent = "Slika je prevelika (najviše 15 MB) — izaberi manju.";
      return;
    }
    slikaIme.textContent = "Učitavam…";
    var citac = new FileReader();
    citac.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        /* umanji veliku fotografiju sa telefona pre nego što je čuvamo kao
           data URL — inače porudžbina zna da bude teška za slanje mejlom */
        var MAKS = 1600;
        var w = img.naturalWidth, h = img.naturalHeight;
        var razmera = Math.min(1, MAKS / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * razmera)), ch = Math.max(1, Math.round(h * razmera));
        var platno = document.createElement("canvas");
        platno.width = cw; platno.height = ch;
        platno.getContext("2d").drawImage(img, 0, 0, cw, ch);
        var providno = file.type === "image/png" || file.type === "image/webp";
        /* zoom/ox/oy: koliko je uvećana i pomerena unutar okvira na proizvodu —
           korisnik ih podešava klizačem i prevlačenjem posle učitavanja */
        posle({ dataUrl: platno.toDataURL(providno ? "image/png" : "image/jpeg", 0.86), ime: file.name, zoom: 1, ox: 0, oy: 0 });
      };
      img.onerror = function () {
        slikaGreska.hidden = false;
        slikaGreska.textContent = "Ova slika nije mogla da se učita — probaj drugu.";
        slikaIme.textContent = "Nijedna slika nije izabrana";
      };
      img.src = e.target.result;
    };
    citac.onerror = function () {
      slikaGreska.hidden = false;
      slikaGreska.textContent = "Čitanje slike nije uspelo — probaj ponovo.";
      slikaIme.textContent = "Nijedna slika nije izabrana";
    };
    citac.readAsDataURL(file);
  }

  if ($("slikaUnos")) {
    $("slikaUnos").addEventListener("change", function () {
      var file = this.files && this.files[0];
      if (!file) return;
      ucitajSliku(file, function (rez) { stanje.slika = rez; osvezi(); });
    });
  }
  if (slikaUkloni) {
    slikaUkloni.addEventListener("click", function () {
      stanje.slika = null;
      $("slikaUnos").value = "";
      osvezi();
    });
  }

  /* uvećanje i prevlačenje poslate slike unutar okvira na proizvodu — samo
     transform na <img>, bez ponovnog crtanja cele forme (osvezi() se zove
     tek kad korisnik pusti prevlačenje, da klizanje ostane glatko) */
  function primeniTransformSlike() {
    if (!stanje.slika) return;
    pregledSlikaImg.style.transform =
      "translate(" + stanje.slika.ox + "%, " + stanje.slika.oy + "%) scale(" + stanje.slika.zoom + ")";
    osveziTrake();
  }

  /* "Trake" — sečemo poslatu sliku na uske vertikalne pojaseve preko
     background-position/-size (ista matematika kao object-fit:cover +
     translate/scale na <img> iznad), pa svaki pojas malo suzimo i zarotiramo
     prema ivicama. Rezultat izgleda kao da slika prati zakrivljenost
     proizvoda, umesto da stoji kao ravan pravougaonik. */
  var TRAKA_BROJ = 16;
  function izgradiTrake() {
    if (!pregledSlikaTrake || pregledSlikaTrake.children.length === TRAKA_BROJ) return;
    pregledSlikaTrake.innerHTML = "";
    for (var i = 0; i < TRAKA_BROJ; i++) {
      var t = document.createElement("div");
      t.className = "trak";
      pregledSlikaTrake.appendChild(t);
    }
  }
  function osveziTrake() {
    if (!pregledSlikaTrake) return;
    if (!stanje.slika) { pregledSlikaTrake.innerHTML = ""; return; }
    izgradiTrake();
    var natW = pregledSlikaImg.naturalWidth, natH = pregledSlikaImg.naturalHeight;
    var kutija = pregledSlikaEl.getBoundingClientRect();
    if (!natW || !natH || !kutija.width || !kutija.height) return;
    var boxW = kutija.width, boxH = kutija.height;
    var coverScale = Math.max(boxW / natW, boxH / natH);
    var zoom = stanje.slika.zoom || 1;
    var dispW = natW * coverScale * zoom, dispH = natH * coverScale * zoom;
    var bgPosX = (boxW - dispW) / 2 + (stanje.slika.ox / 100) * boxW;
    var bgPosY = (boxH - dispH) / 2 + (stanje.slika.oy / 100) * boxH;
    var stripW = boxW / TRAKA_BROJ;
    var deca = pregledSlikaTrake.children;
    for (var i = 0; i < TRAKA_BROJ; i++) {
      var u = ((i + 0.5) / TRAKA_BROJ) * 2 - 1; /* -1..1, levo->desno */
      var bend = Math.cos(u * (Math.PI / 2) * 0.92);
      var scaleY = 0.8 + 0.2 * bend;
      var rot = u * 3.2;
      var el = deca[i];
      el.style.backgroundImage = 'url("' + stanje.slika.dataUrl + '")';
      el.style.backgroundSize = dispW + "px " + dispH + "px";
      el.style.backgroundPosition = (bgPosX - i * stripW) + "px " + bgPosY + "px";
      el.style.transform = "scaleY(" + scaleY + ") rotate(" + rot + "deg)";
    }
  }
  function ogranici(slika) {
    var granica = (slika.zoom - 1) * 50;
    slika.ox = Math.max(-granica, Math.min(granica, slika.ox));
    slika.oy = Math.max(-granica, Math.min(granica, slika.oy));
  }

  if ($("slikaZum")) {
    $("slikaZum").addEventListener("input", function () {
      if (!stanje.slika) return;
      stanje.slika.zoom = Number(this.value) / 100;
      ogranici(stanje.slika);
      osvezi();
    });
  }
  if ($("slikaResetuj")) {
    $("slikaResetuj").addEventListener("click", function () {
      if (!stanje.slika) return;
      stanje.slika.zoom = 1; stanje.slika.ox = 0; stanje.slika.oy = 0;
      osvezi();
    });
  }
  (function () {
    var vuce = null;
    pregledSlikaImg.addEventListener("pointerdown", function (e) {
      if (!stanje.slika || stanje.slika.zoom <= 1) return;
      vuce = { x: e.clientX, y: e.clientY, ox: stanje.slika.ox, oy: stanje.slika.oy };
      pregledSlikaImg.setPointerCapture(e.pointerId);
    });
    pregledSlikaImg.addEventListener("pointermove", function (e) {
      if (!vuce) return;
      var r = pregledSlikaImg.getBoundingClientRect();
      stanje.slika.ox = vuce.ox + (e.clientX - vuce.x) / r.width * 100;
      stanje.slika.oy = vuce.oy + (e.clientY - vuce.y) / r.height * 100;
      ogranici(stanje.slika);
      primeniTransformSlike();
    });
    ["pointerup", "pointercancel"].forEach(function (dogadjaj) {
      pregledSlikaImg.addEventListener(dogadjaj, function () {
        if (vuce) { vuce = null; osvezi(); }
      });
    });
  })();

  RECENICE.slice(0, 5).forEach(function (r) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "cip";
    b.textContent = r.replace(/\n/g, " ");
    b.addEventListener("click", function () { polje.value = r; stanje.tekst = r; osvezi(); polje.focus(); });
    $("cipovi").appendChild(b);
  });

  SLOVA.forEach(function (s) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "izbor__stavka"; b.dataset.id = s.id;
    b.setAttribute("aria-pressed", String(s.id === stanje.slova));
    b.innerHTML =
      '<div class="izbor__uzorak izbor__uzorak--' + s.id + '">' + s.uzorak + "</div>" +
      '<div class="izbor__ime">' + s.ime + "</div>" +
      '<div class="izbor__pod">' + s.pod + "</div>";
    b.addEventListener("click", function () { stanje.slova = s.id; osvezi(); });
    $("izborSlova").appendChild(b);
  });

  BOJE_SLOVA.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "tacka"; b.style.background = c.hex; b.dataset.id = c.id;
    b.title = c.ime;
    b.setAttribute("aria-label", "Boja slova: " + c.ime);
    b.setAttribute("aria-pressed", String(c.id === stanje.bojaSlova));
    b.addEventListener("click", function () { stanje.bojaSlova = c.id; osvezi(); });
    $("izborBojeSlova").appendChild(b);
  });

  function napraviPrekidac(kontejner, opcije, kljuc) {
    if (!kontejner) return;
    kontejner.textContent = "";
    opcije.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "prekidac__dugme"; b.textContent = o.ime;
      b.setAttribute("aria-pressed", String(String(stanje[kljuc]) === String(o.vrednost)));
      b.addEventListener("click", function () { stanje[kljuc] = o.vrednost; osvezi(); });
      kontejner.appendChild(b);
    });
  }

  /* Za svaki upisani red jedan izbor veličine — tako se dobija izgled
     sa naših šolja, gde je jedna reč krupna a ostatak sitniji. */
  function osveziRedove() {
    var linije = redovi(stanje.tekst);
    var okvir = $("redovi");
    var lista = $("redoviLista");
    okvir.hidden = linije.length < 1;
    if (okvir.hidden) { lista.textContent = ""; return; }

    lista.textContent = "";
    linije.forEach(function (linija, i) {
      var red = document.createElement("div");
      red.className = "red-stavka";

      var natpis = document.createElement("span");
      natpis.className = "red-stavka__tekst";
      natpis.textContent = linija;
      red.appendChild(natpis);

      var mere = document.createElement("div");
      mere.className = "red-stavka__mere";
      mere.setAttribute("role", "group");
      mere.setAttribute("aria-label", "Veličina " + (i + 1) + ". reda: " + linija);

      MERE.forEach(function (m) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "mera mera--" + m.id;
        b.textContent = "A";
        b.title = m.ime;
        b.setAttribute("aria-label", m.ime);
        b.setAttribute("aria-pressed", String((stanje.mereRedova[i] || "srednje") === m.id));
        b.addEventListener("click", function () { stanje.mereRedova[i] = m.id; osvezi(); });
        mere.appendChild(b);
      });

      red.appendChild(mere);
      lista.appendChild(red);
    });
  }

  function izracunaj() {
    var p = nadji(PROIZVODI, stanje.proizvod);
    if (p.upit) {
      return { iznos: null, cenaTekst: "na upit", opis: p.ime + "<br />" + stanje.kolicina + " kom<br />javljamo cenu" };
    }
    /* Proizvod sa jedinstvenom cenom po komadu (tumbler) — nema komplet-cenu
       kao šoljice, pa se prosto množi količinom. */
    if (p.cena) {
      var ukupno = p.cena * stanje.kolicina;
      return {
        iznos: ukupno, cenaTekst: dinari(ukupno),
        opis: p.ime + "<br />" + stanje.kolicina + " kom" + (p.ml ? "<br />" + p.ml + " ml" : "")
      };
    }
    if (stanje.kolicina === 2) return { iznos: CENE.dve, cenaTekst: dinari(CENE.dve), opis: "Bela šoljica<br />2 kom<br />" + stanje.velicina + " ml" };
    return { iznos: CENE.jedna, cenaTekst: dinari(CENE.jedna), opis: "Bela šoljica<br />1 kom<br />" + stanje.velicina + " ml" };
  }

  /* Specifikacija porudžbine — deli je tekstPorudzbine() (kopiranje teksta)
     i dugme "Pošalji porudžbinu" (modal koji šalje mejlom). */
  function specifikacija() {
    var p = nadji(PROIZVODI, stanje.proizvod);
    var c = izracunaj();
    var linije = [
      "Proizvod: " + p.ime
        + (p.zapremina ? " sa tacnom, " + stanje.velicina + " ml" : "")
        + (p.ml ? ", " + p.ml + " ml" : "")
        + ", " + stanje.kolicina + " kom"
    ];
    var natpis;

    if (stanje.nacin === "slika") {
      natpis = stanje.slika ? "slika u prilogu (" + stanje.slika.ime + ")" : "(još nije poslata)";
      linije.push("Personalizacija: sopstvena slika/logo — " + natpis);
      linije.push("Napomena: slika se šalje uz porudžbinu; ako ne stigne u prilogu, pošalji je i na Instagram poruku.");
    } else {
      var red = redovi(stanje.tekst);
      /* svaki red nosi svoju veličinu, npr. NIŠTA (krupno) / jela nisam (sitno) */
      natpis = red.length
        ? red.map(function (l, i) {
            return l + " (" + nadji(MERE, stanje.mereRedova[i] || "srednje").ime.toLowerCase() + ")";
          }).join(" / ")
        : "(dogovaramo se)";
      linije.push("Natpis: " + natpis);
      linije.push("Slova: " + nadji(SLOVA, stanje.slova).ime);
      linije.push("Boja slova: " + nadji(BOJE_SLOVA, stanje.bojaSlova).ime);
    }

    return { cena: c, natpis: natpis, linije: linije };
  }

  function tekstPorudzbine() {
    var s = specifikacija();
    return [
      "Zdravo Bedžić! Evo šta bih naručio/la:", ""
    ].concat(s.linije).concat([
      "Cena: " + s.cena.cenaTekst, "",
      "Ime i prezime:", "Grad:", "Preuzimanje: lično u Novom Sadu / Post Express (poštarina 600 din)"
    ]).join("\n");
  }

  var potvrda = $("potvrda");
  var pregledNatpisEl = $("pregledNatpis");

  function osvezi() {
    var p = nadji(PROIZVODI, stanje.proizvod);

    /* prvi korak — ostatak konfiguratora se ne prikazuje dok se nešto ne
       izabere na velikim karticama iznad */
    konfigRed.hidden = !stanje.proizvodIzabran;
    Array.prototype.forEach.call(document.querySelectorAll("#izborProizvod .tile"), function (kartica) {
      kartica.classList.toggle("tile--izabran", stanje.proizvodIzabran && kartica.dataset.id === stanje.proizvod);
    });
    if (!stanje.proizvodIzabran) return;

    /* proizvod: menja fotografiju u pregledu i koje korake konfiguratora vidiš */
    if (scenaProizvod.dataset.proizvod !== p.id) {
      scenaProizvod.dataset.proizvod = p.id;
      proizvodFoto.src = p.foto;
      proizvodFoto.alt = p.fotoAlt;
      proizvodFoto.width = p.fotoW;
      proizvodFoto.height = p.fotoH;
    }
    var dugmadNacin = $("izborNacin").querySelectorAll(".prekidac__dugme");
    for (var ni = 0; ni < dugmadNacin.length; ni++) {
      dugmadNacin[ni].setAttribute("aria-pressed", String(NACINI[ni].id === stanje.nacin));
    }

    var grupaZ = $("izborVelicine");
    if (grupaZ) grupaZ.hidden = !p.zapremina;

    /* način: tekst ili sopstvena slika — obe dele isti okvir na proizvodu */
    var tekstMod = stanje.nacin === "tekst";
    grupaTekst.hidden = !tekstMod;
    grupaSlika.hidden = tekstMod;
    pregledNatpisEl.hidden = !tekstMod;
    /* slika koju kupac pošalje se više NE prikazuje uklopljena na proizvodu —
       samo se prilaže uz porudžbinu i stiže na mejl, dogovara se izgled ručno. */
    pregledSlikaEl.hidden = true;
    $("korak3Ime").textContent = tekstMod ? "Šta piše" : "Tvoja slika";

    /* Količina se više ne bira u konfiguratoru — uvek je jedan komad;
       za više komada kupac piše u napomenu porudžbine. */
    /* Tumbler ima samo jednu zapreminu, pa se ceo korak sklanja — bez ovoga
       bi na strani stajao prazan panel sa naslovom „Zapremina". */
    var poljeVel = $("izborVelicine");
    var korakVel = poljeVel && poljeVel.closest(".korak");
    if (p.zapremina) {
      napraviPrekidac(poljeVel,
        [{ ime: "150 ml", vrednost: "150" }, { ime: "200 ml", vrednost: "200" }], "velicina");
      if (korakVel) korakVel.hidden = false;
    } else if (korakVel) {
      korakVel.hidden = true;
    }

    [["izborSlova", stanje.slova], ["izborBojeSlova", stanje.bojaSlova]]
      .forEach(function (par) {
        var dugmad = $(par[0]).querySelectorAll("[data-id]");
        for (var i = 0; i < dugmad.length; i++) {
          dugmad[i].setAttribute("aria-pressed", String(dugmad[i].dataset.id === par[1]));
        }
      });

    osveziRedove();
    ispisi(pregledNatpisEl, stanje.tekst, stanje.slova,
           nadji(BOJE_SLOVA, stanje.bojaSlova).hex, null, stanje.mereRedova);

    /* slika koju je korisnik poslao — ista <img> se posle klonira u modal
       porudžbine, pa kupac tačno vidi šta smo primili */
    if (stanje.slika) {
      slikaIme.textContent = stanje.slika.ime;
      slikaUkloni.hidden = false;
    } else {
      slikaIme.textContent = "Nijedna slika nije izabrana";
      slikaUkloni.hidden = true;
    }

    var c = izracunaj();
    var cenaEl = $("cena");
    cenaEl.textContent = p.upit ? "Na upit" : c.cenaTekst;
    cenaEl.classList.toggle("pregled__iznos--upit", !!p.upit);
    $("cenaOpis").innerHTML = c.opis;

    var dugme = $("dugmePorudzbina");
    if (dugme) dugme.textContent = p.upit ? "Pošalji upit" : "Pošalji porudžbinu";

    potvrda.hidden = true;
  }

  polje.addEventListener("input", function () { stanje.tekst = polje.value; osvezi(); });

  if ($("dugmePorudzbina")) {
    $("dugmePorudzbina").addEventListener("click", function () {
      if (stanje.nacin === "slika" && !stanje.slika) {
        slikaGreska.hidden = false;
        slikaGreska.textContent = "Izaberi sliku pre nego što pošalješ porudžbinu.";
        $("slikaUnos").focus();
        return;
      }

      var p = nadji(PROIZVODI, stanje.proizvod);
      var s = specifikacija();
      otvoriModal({
        ime: p.ime + " po tvojoj želji",
        cena: p.upit ? "Na upit" : s.cena.cenaTekst,
        detalj: stanje.kolicina + " kom"
          + (p.zapremina ? " · " + stanje.velicina + " ml" : "")
          + (p.ml ? " · " + p.ml + " ml" : ""),
        upit: !!p.upit,
        /* ne gola fotografija proizvoda — kloniramo živi pregled iz
           konfiguratora, da kupac u porudžbini vidi tačno svoj natpis/sliku */
        pregledEl: document.querySelector(".scena"),
        /* slika koju je poslao — nosimo je do submit handlera, koji je šalje
           kao pravi prilog čim WEB3FORMS_KLJUC bude upisan. Zove se drugačije
           od info.slika (to je URL fotografije proizvoda kod gotovih artikala). */
        korisnickaSlika: stanje.nacin === "slika" ? stanje.slika : null,
        opisDodatak: stanje.nacin === "slika"
          ? ["Personalizacija: sopstvena slika/logo (vidi se u pregledu ispod)"]
          : [
              "Natpis: " + s.natpis,
              "Slova: " + nadji(SLOVA, stanje.slova).ime,
              "Boja slova: " + nadji(BOJE_SLOVA, stanje.bojaSlova).ime
            ]
      }, $("dugmePorudzbina"));
    });
  }

  if (WHATSAPP_BROJ) {
    var wa = document.createElement("a");
    wa.className = "dugme dugme--tiho"; wa.target = "_blank"; wa.rel = "noopener";
    wa.textContent = "Pošalji na WhatsApp";
    wa.href = "https://wa.me/" + WHATSAPP_BROJ;
    wa.addEventListener("click", function () {
      wa.href = "https://wa.me/" + WHATSAPP_BROJ + "?text=" + encodeURIComponent(tekstPorudzbine());
    });
    document.querySelector(".porudzbina__dugmad").appendChild(wa);
  }

  osvezi();
  } /* kraj: if (polje) — blok specifičan za konfigurator */

  /* ====== Filtriranje gotovih proizvoda ====== */
  (function () {
    var VRSTE = [
      { id: "sve",     ime: "Sve" },
      { id: "solje",   ime: "Šoljice" },
      { id: "limenke", ime: "Limenke" },
      { id: "flasice", ime: "Flašice" },
      { id: "tumbleri", ime: "Tumbleri / Termosi" },
      { id: "cegeri",  ime: "Cegeri" },
      { id: "bedzevi", ime: "Bedževi" },
      { id: "peratonice", ime: "Peratonice" },
      { id: "posude", ime: "Posude za ljubimce" }
    ];
    /* Dugme se pojavi samo ako neki proizvod stvarno nosi tu temu —
       zato spisak može unapred da sadrži i teme koje tek dolaze. */
    var TEME = [
      { id: "sve",        ime: "Sve" },
      { id: "slavica",    ime: "Moja Slavice" },
      { id: "horoskop",   ime: "Horoskop" },
      { id: "saljive",    ime: "Najprodavanije" },
      { id: "studenti",   ime: "Studenti pobeđuju" },
      { id: "ljubimci",   ime: "Ljubimci" },
      { id: "ljubav",     ime: "Ljubav" },
      { id: "porodica",   ime: "Porodica" },
      { id: "deca",       ime: "Za decu" },
      { id: "sport",      ime: "Sport" },
      { id: "medicina",   ime: "Zanimanja" },
      { id: "serije",     ime: "Filmovi i serije" },
      { id: "ostalo",     ime: "Šef" }
    ];

    var izbor = { vrsta: "sve", tema: "sve" };
    var proizvodi = [].slice.call(document.querySelectorAll(".proizvod"));
    if (!proizvodi.length) return;

    /* Link sa druge strane može doći sa ?tema=slavica,ljubimci —
       tada se pokažu proizvodi iz OBE teme odjednom (npr. "nova kolekcija"). */
    var upit = new URLSearchParams(location.search);
    var paramTema = upit.get("tema");
    if (paramTema) {
      var listaTema = paramTema.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
      if (listaTema.length === 1) izbor.tema = listaTema[0];
      else if (listaTema.length > 1) izbor.tema = listaTema;
    }
    /* ?vrsta=solje — prečice po vrsti proizvoda sa naslovne.
       Priznajemo svaku vrstu iz VRSTE, i onu koja trenutno nema nijedan
       proizvod (npr. bedževi): tada se pokaže poruka „nemamo gotov proizvod",
       što je poštenije nego da prečica tiho izlista ceo katalog. */
    var paramVrsta = upit.get("vrsta");
    var vrstaPostoji = VRSTE.some(function (v) { return v.id === paramVrsta; });
    if (paramVrsta && vrstaPostoji) izbor.vrsta = paramVrsta;

    var prazno = document.createElement("p");
    prazno.className = "prazno-stanje";
    prazno.hidden = true;
    prazno.textContent = "Za ovaj izbor nemamo gotov proizvod — ali možeš da ga napraviš po svojoj želji.";
    var poslednjiKatalog = document.querySelectorAll("#gotove .katalog");
    poslednjiKatalog[poslednjiKatalog.length - 1].parentNode
      .insertBefore(prazno, poslednjiKatalog[poslednjiKatalog.length - 1].nextSibling);

    /* Teme se prikazuju samo ako u IZABRANOJ vrsti postoji proizvod sa tom
       temom. Inače bi kod peratonica stajao ceo spisak (Horoskop, Sport…)
       iako sve osim „Za decu" daje prazan rezultat. */
    function sreziTeme() {
      var kutija = $("filterTema");
      if (!kutija) return;
      var imaBilošta = false;
      Array.prototype.forEach.call(kutija.children, function (cip) {
        var tema = cip.dataset.vrednost;
        if (tema === "sve") { cip.hidden = false; return; }
        var izborВ = izbor.vrsta === "sve"
          ? '.proizvod[data-tema="' + tema + '"]'
          : '.proizvod[data-vrsta="' + izbor.vrsta + '"][data-tema="' + tema + '"]';
        var postoji = !!document.querySelector(izborВ);
        cip.hidden = !postoji;
        if (postoji) imaBilošta = true;
      });
      /* Tema se više NE resetuje na „Sve" kad kombinacija vrsta+tema nema
         proizvoda — red je sad skriven (izbor je već napravljen na
         naslovnoj), pa bi tihi reset ovde samo prikazao tuđe proizvode
         (npr. Peppa flašice) dok korisnik misli da je i dalje u temi
         Moja Slavice. Prazno stanje ("nemamo gotov proizvod") je ispravan
         ishod za takvu kombinaciju. */
      /* red sa temama se više ne prikazuje ovde — izbor teme se pravi na
         naslovnoj (ikonice), a ovde bi bio suvišan ponovljen izbor. Čipovi
         i dalje postoje u pozadini jer preko njih ide sam filter. */
      var red = kutija.closest(".filteri__red");
      if (red) red.hidden = true;
    }

    function primeni() {
      sreziTeme();
      var vidljivih = 0;
      proizvodi.forEach(function (p) {
        /* kartica može da nosi više tema odjednom, odvojenih zarezom
           (npr. "ljubimci,ljubav") — pripada svakoj od njih */
        var kartaTeme = (p.getAttribute("data-tema") || "").split(",");
        var temaOk = izbor.tema === "sve" ||
          (Array.isArray(izbor.tema)
            ? izbor.tema.some(function (t) { return kartaTeme.indexOf(t) !== -1; })
            : kartaTeme.indexOf(izbor.tema) !== -1);
        var ok = (izbor.vrsta === "sve" || p.getAttribute("data-vrsta") === izbor.vrsta) && temaOk;
        p.hidden = !ok;
        if (ok) vidljivih++;
      });

      /* sakrij naslov grupe ako u njoj nema ničega.
         Redosled mora da prati redosled .katalog mreža u HTML-u:
         Gotove šoljice → Horoskop → Ostalo iz radionice. */
      [["naslovSolje", 0], ["naslovHoroskop", 1], [null, 2]].forEach(function (par) {
        var mreza = document.querySelectorAll("#gotove .katalog")[par[1]];
        if (!mreza) return;
        var prazna = !mreza.querySelector(".proizvod:not([hidden])");
        /* treća grupa više nema naslov, pa se sakriva sama za sebe */
        var naslov = par[0] ? $(par[0]) : null;
        if (naslov) naslov.hidden = prazna;
        mreza.hidden = prazna;
      });

      /* naslov prve grupe prati izabranu vrstu — inače bi kod cegera,
         tumblera itd. stajalo „Gotove šoljice" iznad tuđih proizvoda */
      var naslovPrve = $("naslovSolje");
      var glavniNaslov = $("glavniNaslov");
      var posebanNaziv = null;
      if (izbor.vrsta !== "sve" && izbor.vrsta !== "solje") {
        var vrstaObj = VRSTE.filter(function (v) { return v.id === izbor.vrsta; })[0];
        posebanNaziv = vrstaObj ? vrstaObj.ime : null;
      } else if (izbor.tema !== "sve" && !Array.isArray(izbor.tema)) {
        var temaObj = TEME.filter(function (t) { return t.id === izbor.tema; })[0];
        posebanNaziv = temaObj ? temaObj.ime : null;
      }
      if (naslovPrve) naslovPrve.textContent = posebanNaziv || "Gotove šoljice";
      /* kad je izbor jasan (stiglo se sa naslovne preko teme/vrste), naziv
         ide krupno gore uz "Naši dizajni" — mala pločica ispod filtera bi
         bila suvišno ponavljanje istog naziva. */
      if (glavniNaslov) {
        glavniNaslov.textContent = posebanNaziv || "Naši dizajni, spremni za poručivanje";
      }
      if (naslovPrve) naslovPrve.hidden = !!posebanNaziv;

      prazno.hidden = vidljivih > 0;
      $("filterBroj").textContent = vidljivih === proizvodi.length
        ? "Prikazano svih " + proizvodi.length + " proizvoda"
        : "Prikazano " + vidljivih + " od " + proizvodi.length + " proizvoda";

      /* napomena o dečijim šoljama važi za celu temu, ne za jednu karticu —
         prikazuje se samo dok je tema „Za decu“ aktivna */
      var napomenaDeca = $("napomenaDeca");
      if (napomenaDeca) napomenaDeca.hidden = izbor.tema !== "deca";
    }

    function napravi(kutija, spisak, kljuc) {
      spisak.forEach(function (s) {
        /* preskoči temu/vrstu koju nijedan proizvod nema */
        if (s.id !== "sve" && !document.querySelector('.proizvod[data-' + kljuc + '="' + s.id + '"]')) return;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "cip";
        /* teme dobijaju crtež iznad naziva; vrste ostaju obične pilule */
        if (kljuc === "tema" && document.getElementById("tema-" + s.id)) {
          b.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><use href="#tema-' + s.id + '"/></svg>'
                      + '<span>' + s.ime + '</span>';
        } else {
          b.textContent = s.ime;
        }
        b.dataset.vrednost = s.id;
        b.setAttribute("aria-pressed", String(Array.isArray(izbor[kljuc]) ? izbor[kljuc].indexOf(s.id) !== -1 : izbor[kljuc] === s.id));
        b.addEventListener("click", function () {
          izbor[kljuc] = s.id;
          Array.prototype.forEach.call(kutija.children, function (x) {
            x.setAttribute("aria-pressed", String(x.dataset.vrednost === s.id));
          });
          primeni();
        });
        kutija.appendChild(b);
      });
    }

    napravi($("filterVrsta"), VRSTE, "vrsta");
    napravi($("filterTema"), TEME, "tema");
    primeni();
    if (paramTema || paramVrsta) $("gotove").scrollIntoView({ block: "start" });
  })();

  /* ====== Modal za porudžbinu — forma, slanje mejlom, zahvalnica ======
     Postoji na katalogu gotovih proizvoda (gotovi.html) i na konfiguratoru
     (napravi.html) — na ostalim stranama #modal ne postoji, pa ceo blok
     bezbedno preskačemo. */
  if (modal) {
  Array.prototype.forEach.call(modal.querySelectorAll("[data-zatvori]"), function (el) {
    el.addEventListener("click", zatvoriModal);
  });

  /* obavezna slika za štampu u samoj porudžbini — samo ispisuje ime
     izabranog fajla, čitanje ide tek pri slanju (forma.addEventListener submit) */
  if ($("modalSlikaUnos")) {
    $("modalSlikaUnos").addEventListener("change", function () {
      var f = this.files[0];
      $("modalSlikaIme").textContent = f ? f.name : "Nijedna slika nije izabrana";
      this.setAttribute("aria-invalid", String(!f));
      var mini = $("modalSlikaMini");
      if (mini && f) {
        var citac = new FileReader();
        citac.onload = function () { mini.src = citac.result; mini.hidden = false; };
        citac.readAsDataURL(f);
      }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) zatvoriModal();
  });

  Array.prototype.forEach.call(document.querySelectorAll(".proizvod .naruci"), function (dugme) {
    var karta = dugme.closest ? dugme.closest(".proizvod") : dugme.parentNode.parentNode;
    /* Proizvod obeležen kao „uskoro“ (bela, tiha korpica) još se ne prodaje —
       dugme ostaje vidljivo, ali ne otvara porudžbinu. */
    if (karta.getAttribute("data-uskoro") === "da") {
      dugme.disabled = true;
      return;
    }
    dugme.addEventListener("click", function () {
      var slikaEl = karta.querySelector(".karta__slika img");
      otvoriModal({
        ime: karta.getAttribute("data-ime"),
        cena: karta.getAttribute("data-cena"),
        detalj: karta.getAttribute("data-materijal"),
        upit: karta.getAttribute("data-upit") === "da",
        /* šoljice od 330 ml dolaze u jednoj veličini — bira se samo za one
           gde postoji izbor 150/200 ml */
        zapremina: karta.getAttribute("data-vrsta") === "solje" && karta.getAttribute("data-bez-zapremine") !== "da",
        slika: slikaEl ? slikaEl.getAttribute("src") : null,
        slikaAlt: slikaEl ? slikaEl.getAttribute("alt") : "",
        /* proizvod može da ima jednu ili dve grupe izbora */
        varijanteGrupe: [
          ["data-varijanta-ime", "data-varijante"],
          ["data-varijanta2-ime", "data-varijante2"]
        ].map(function (par) {
          var vred = karta.getAttribute(par[1]);
          if (!vred) return null;
          return { ime: karta.getAttribute(par[0]) || "Izaberi", opcije: vred.split("|") };
        }).filter(Boolean),
        unosLabel: karta.getAttribute("data-unos")
      }, dugme);
    });
  });

  function sastaviPorudzbinu(podaci) {
    var info = aktivnaInfo;
    var r = [
      (info.upit ? "UPIT" : "PORUDŽBINA") + " sa sajta — Bedžić", "",
      "Proizvod: " + info.ime,
      "Detalji: " + (info.detalj || ""),
      "Cena: " + info.cena
    ];
    if (info.opisDodatak) r.push.apply(r, info.opisDodatak);
    /* svaka grupa izbora upisuje svoj red — proizvod ih može imati više */
    Array.prototype.forEach.call(modal.querySelectorAll("#modalVarijante .grupa"), function (g) {
      var sel = g.querySelector(".prekidac__dugme[aria-pressed='true']");
      if (sel) r.push((g.dataset.ime || "Izbor") + ": " + sel.textContent);
    });
    if (podaci.unos) r.push((info.unosLabel || "Unos") + ": " + podaci.unos);
    /* zapremina ide u porudžbinu samo ako je izbor bio prikazan (šoljice) */
    var gz = $("grupaZapremina");
    if (podaci.zapremina && gz && !gz.hidden) r.push("Zapremina: " + podaci.zapremina);
    if (podaci.dostava) r.push("Preuzimanje: " + podaci.dostava);
    r.push("", "Ime i prezime: " + podaci.ime,
           "Telefon: " + podaci.telefon,
           "Adresa: " + podaci.adresa,
           "Grad: " + podaci.grad + (podaci.posta ? ", " + podaci.posta : ""));
    if (podaci.napomena) r.push("Napomena: " + podaci.napomena);
    return r.join("\n");
  }

  forma.addEventListener("submit", function (e) {
    e.preventDefault();
    var greska = $("modalGreska");
    greska.hidden = true;

    var podaci = {};
    Array.prototype.forEach.call(forma.elements, function (el) {
      if (!el.name) return;
      /* radio dugmad: uzmi vrednost SAMO od štikliranog, inače bi poslednji
         u grupi pregazio izbor korisnika */
      if (el.type === "radio") { if (el.checked) podaci[el.name] = el.value; return; }
      podaci[el.name] = String(el.value || "").trim();
    });

    /* provera obaveznih polja */
    var fali = [];
    [["ime", "ime i prezime"], ["telefon", "telefon"], ["grad", "grad"], ["posta", "poštanski broj"], ["adresa", "adresa"], ["slikaPorudzbina", "slika za štampu"]]
      .forEach(function (par) {
        var polje = forma.elements[par[0]];
        if (!polje) return; /* npr. slika za štampu postoji samo u konfiguratoru */
        var prazno = !podaci[par[0]];
        polje.setAttribute("aria-invalid", String(prazno));
        if (prazno) fali.push(par[1]);
      });
    if (aktivnaInfo.unosLabel && !podaci.unos) {
      fali.push(aktivnaInfo.unosLabel.toLowerCase());
    }
    if (fali.length) {
      greska.hidden = false;
      greska.textContent = "Nedostaje: " + fali.join(", ") + ".";
      return;
    }

    var tekst = sastaviPorudzbinu(podaci);
    var dugme = $("modalPosalji");
    dugme.disabled = true;
    dugme.textContent = "Šaljem…";

    function uspelo() {
      forma.hidden = true;
      hvala.hidden = false;
      $("hvalaSazetak").textContent = tekst;
      hvala.scrollIntoView({ block: "nearest" });
      vatromet(hvala);
    }
    function nijeUspelo(poruka) {
      dugme.disabled = false;
      dugme.textContent = aktivnaInfo.upit ? "Pošalji upit" : "Pošalji porudžbinu";
      greska.hidden = false;
      greska.textContent = poruka;
    }

    var naslov = (aktivnaInfo.upit ? "Upit" : "Porudžbina") + " sa sajta — " + aktivnaInfo.ime;

    /* slika za štampu je sada obavezna u svakoj porudžbini (posebno polje
       u formi) — čita se ovde kao dataURL pre slanja; ako je proizvod iz
       konfiguratora, ovo zamenjuje sliku koju je kupac tamo već poslao. */
    var fajlSlike = forma.elements.slikaPorudzbina && forma.elements.slikaPorudzbina.files[0];
    if (fajlSlike) {
      var citac = new FileReader();
      citac.onload = function () {
        nastaviSlanje({ dataUrl: citac.result, ime: fajlSlike.name });
      };
      citac.readAsDataURL(fajlSlike);
    } else {
      nastaviSlanje(aktivnaInfo.korisnickaSlika || null);
    }

    function nastaviSlanje(korisnickaSlika) {
    /* slika koju je kupac poslao — mailto ne ume da nosi priloge, pa mu je
       odmah spuštamo na disk da je ručno doda uz mejl (ili pošalje na
       Instagram, kao i do sada kod kopiranja teksta) */
    if (korisnickaSlika && !WEB3FORMS_KLJUC) {
      var a = document.createElement("a");
      a.href = korisnickaSlika.dataUrl;
      a.download = korisnickaSlika.ime || "slika.jpg";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    if (!WEB3FORMS_KLJUC) {
      /* Ključ još nije upisan — umesto da porudžbina propadne, otvara se mejl
         program kupca sa već popunjenim primaocem, naslovom i celim tekstom.
         Kupcu ostaje samo da pritisne „Pošalji" i poruka stiže na EMAIL.
         Kopiramo i u clipboard, za slučaj da mejl program nije podešen. */
      kopiraj(tekst, $("modalInfo"));
      window.location.href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(naslov) +
        "&body=" + encodeURIComponent(tekst);
      uspelo();
      return;
    }

    /* slika ide kao pravi prilog (multipart), zato ide FormData a ne JSON —
       web3forms sam prepozna fajl polje i zakači ga na mejl */
    var zahtev;
    if (korisnickaSlika) {
      var podaciSlanja = new FormData();
      podaciSlanja.append("access_key", WEB3FORMS_KLJUC);
      podaciSlanja.append("subject", naslov);
      podaciSlanja.append("from_name", "Bedžić sajt");
      podaciSlanja.append("replyto", EMAIL);
      podaciSlanja.append("proizvod", aktivnaInfo.ime);
      podaciSlanja.append("cena", aktivnaInfo.cena);
      podaciSlanja.append("ime", podaci.ime);
      podaciSlanja.append("telefon", podaci.telefon);
      podaciSlanja.append("adresa", podaci.adresa);
      podaciSlanja.append("grad", podaci.grad);
      podaciSlanja.append("posta", podaci.posta || "");
      podaciSlanja.append("dostava", podaci.dostava || "");
      podaciSlanja.append("napomena", podaci.napomena || "");
      podaciSlanja.append("message", tekst);
      podaciSlanja.append("attachment", dataUrlUBlob(korisnickaSlika.dataUrl), korisnickaSlika.ime || "slika.jpg");
      zahtev = fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { Accept: "application/json" }, body: podaciSlanja
      });
    } else {
      zahtev = fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KLJUC,
          subject: naslov,
          from_name: "Bedžić sajt",
          replyto: EMAIL,
          proizvod: aktivnaInfo.ime,
          cena: aktivnaInfo.cena,
          ime: podaci.ime, telefon: podaci.telefon,
          adresa: podaci.adresa, grad: podaci.grad, posta: podaci.posta,
          dostava: podaci.dostava,
          napomena: podaci.napomena,
          message: tekst
        })
      });
    }

    zahtev
      .then(function (o) { return o.json(); })
      .then(function (o) {
        if (o && o.success) { uspelo(); }
        else { nijeUspelo("Slanje nije uspelo. Pokušaj ponovo ili nam piši na " + EMAIL + "."); }
      })
      .catch(function () {
        nijeUspelo("Nema veze sa internetom. Pokušaj ponovo ili nam piši na " + EMAIL + ".");
      });
    } /* kraj: nastaviSlanje() */
  });
  } /* kraj: if (modal) — blok specifičan za katalog gotovih proizvoda */

  /* ====== Šipka napretka ispod trake „Najtraženije" (naslovna) ======
     Pokazuje koliko je traka prevučena. Kad sve kartice stanu u red i nema
     šta da se prevlači, šipka ostaje puna. */
  (function () {
    var traka = $("hitTraka"), sipka = $("hitSipka");
    if (!traka || !sipka) return;
    var nazad = $("hitNazad"), napred = $("hitNapred");

    function osvezi() {
      var maks = traka.scrollWidth - traka.clientWidth;
      var udeo = maks > 1 ? traka.scrollLeft / maks : 1;
      /* uvek se vidi bar deo šipke, da ne izgleda prazno na početku */
      sipka.style.width = (18 + udeo * 82) + "%";
      /* strelica se gasi na kraju trake; tolerancija pokriva unutrašnji
         padding trake i zaokruživanje pri zumiranju stranice */
      if (nazad)  nazad.disabled  = traka.scrollLeft <= 8;
      if (napred) napred.disabled = traka.scrollLeft >= maks - 8;
    }

    /* pomeramo za jednu karticu (širina prve + razmak) */
    function korak() {
      var k = traka.firstElementChild;
      if (!k) return 240;
      var razmak = parseFloat(getComputedStyle(traka).columnGap || "12") || 12;
      return k.getBoundingClientRect().width + razmak;
    }
    function pomeri(smer) {
      traka.scrollBy({ left: smer * korak(), behavior: mirnije ? "auto" : "smooth" });
    }
    if (nazad)  nazad.addEventListener("click", function () { pomeri(-1); });
    if (napred) napred.addEventListener("click", function () { pomeri(1); });

    /* Prevlačenje mišem — na telefonu radi dodir, ali na računaru traka
       nema vidljiv klizač, pa se bez ovoga uopšte ne bi mogla pomeriti. */
    var vuce = false, pocetakX = 0, pocetakScroll = 0, pomereno = 0;
    traka.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;   /* dodir već radi sam */
      vuce = true; pomereno = 0;
      pocetakX = e.clientX; pocetakScroll = traka.scrollLeft;
      traka.setPointerCapture(e.pointerId);
      traka.style.cursor = "grabbing";
    });
    traka.addEventListener("pointermove", function (e) {
      if (!vuce) return;
      var d = e.clientX - pocetakX;
      pomereno = Math.max(pomereno, Math.abs(d));
      traka.scrollLeft = pocetakScroll - d;
    });
    ["pointerup", "pointercancel"].forEach(function (dog) {
      traka.addEventListener(dog, function () {
        if (!vuce) return;
        vuce = false; traka.style.cursor = "";
      });
    });
    /* posle pravog prevlačenja ne otvaraj karticu na koju je pokazivač pao */
    traka.addEventListener("click", function (e) {
      if (pomereno > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    traka.addEventListener("scroll", osvezi, { passive: true });
    window.addEventListener("resize", osvezi);
    osvezi();
  })();


  /* ---- Rayo paneli: strelice pomeraju traku opcija ------------------
     Sadržaj traka pravi konfigurator naknadno (stilovi slova, boje,
     zapremine), pa strelice ne možemo vezati jednom — posmatramo
     promene i svaki put ponovo računamo da li traka uopšte preliva. */
  (function () {
    var paneli = document.querySelectorAll(".rayo");
    if (!paneli.length) return;

    function osveziPanel(panel) {
      var traka = panel.querySelector(".rayo__traka");
      if (!traka) return;
      var preliva = traka.scrollWidth - traka.clientWidth > 2;
      if (preliva) panel.setAttribute("data-preliva", "");
      else panel.removeAttribute("data-preliva");

      var levo = traka.scrollLeft;
      var kraj = traka.scrollWidth - traka.clientWidth - 2;
      Array.prototype.forEach.call(panel.querySelectorAll(".rayo__str"), function (d) {
        d.disabled = +d.getAttribute("data-smer") < 0 ? levo <= 2 : levo >= kraj;
      });
    }

    Array.prototype.forEach.call(paneli, function (panel) {
      var traka = panel.querySelector(".rayo__traka");
      if (!traka) return;

      Array.prototype.forEach.call(panel.querySelectorAll(".rayo__str"), function (dugme) {
        dugme.addEventListener("click", function () {
          /* pola širine trake — uvek ostane bar jedna stavka kao orijentir */
          var korak = Math.max(140, Math.round(traka.clientWidth * 0.6));
          traka.scrollBy({ left: +dugme.getAttribute("data-smer") * korak, behavior: mirnije ? "auto" : "smooth" });
        });
      });

      traka.addEventListener("scroll", function () { osveziPanel(panel); }, { passive: true });
      new MutationObserver(function () { osveziPanel(panel); }).observe(traka, { childList: true, subtree: true });
      /* Sadržaj se ubaci pre nego što raspored slegne, pa merenje odmah po
         ubacivanju još pokazuje pogrešnu širinu — ResizeObserver hvata i
         to i svaku kasniju promenu širine kolone. */
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function () { osveziPanel(panel); });
        ro.observe(traka);
        if (traka.firstElementChild) ro.observe(traka.firstElementChild);
      }
      osveziPanel(panel);
    });

    window.addEventListener("resize", function () {
      Array.prototype.forEach.call(paneli, osveziPanel);
    });
  })();


  /* ---- Izlog „Najtraženije" ------------------------------------------
     Spisak naziva desno upravlja fotografijom levo. Stavka se pali kad
     pređeš mišem, kad je fokusiraš tastaturom ili kad joj dođe red — sam
     se smenjuje na 4,5 s. Klik i dalje vodi na katalog, pa blok radi i
     bez JavaScripta. */
  (function () {
    var izlog = $("izlog");
    if (!izlog) return;

    var spisak = $("izlogSpisak"), foto = $("izlogFoto"), cena = $("izlogCena"),
        opis = $("izlogOpis"), veza = $("izlogVeza"),
        ime = $("izlogIme"), oznaka = $("izlogOznaka"), dugme = $("izlogDugme");
    var stavke = spisak ? spisak.querySelectorAll(".izlog__tacka") : [];
    if (!foto || stavke.length < 2) return;

    var tekuca = 0, sat = null;

    function prikazi(i) {
      if (i === tekuca) return;
      var a = stavke[i];
      tekuca = i;

      for (var j = 0; j < stavke.length; j++) {
        stavke[j].className = "izlog__tacka" + (j === i ? " izlog__tacka--tekuca" : "");
      }

      izlog.style.setProperty("--ram", a.getAttribute("data-boja"));
      cena.textContent = a.getAttribute("data-cena");
      ime.textContent = a.getAttribute("data-ime");
      oznaka.textContent = a.getAttribute("data-oznaka");
      opis.textContent = a.getAttribute("data-opis");
      veza.setAttribute("href", a.getAttribute("href"));
      dugme.setAttribute("href", a.getAttribute("href"));

      if (mirnije) {
        foto.src = a.getAttribute("data-foto");
        foto.alt = a.getAttribute("data-alt");
        return;
      }
      /* slika se prvo ugasi, pa se tek učitana vrati — bez treptaja */
      izlog.classList.add("izlog--menja");
      var nova = new Image();
      nova.onload = nova.onerror = function () {
        foto.src = a.getAttribute("data-foto");
        foto.alt = a.getAttribute("data-alt");
        izlog.classList.remove("izlog--menja");
      };
      nova.src = a.getAttribute("data-foto");
    }

    function dalje() { prikazi((tekuca + 1) % stavke.length); }
    function pokreni() { if (!sat && !mirnije) sat = setInterval(dalje, 4500); }
    function stani() { if (sat) { clearInterval(sat); sat = null; } }

    Array.prototype.forEach.call(stavke, function (a, i) {
      a.addEventListener("mouseenter", function () { stani(); prikazi(i); });
      a.addEventListener("focus", function () { stani(); prikazi(i); });
      /* na dodir prvi tap samo menja sliku, drugi otvara katalog */
      a.addEventListener("click", function (e) {
        e.preventDefault(); stani(); prikazi(i);
      });
    });
    izlog.addEventListener("mouseleave", pokreni);
    izlog.addEventListener("focusout", function (e) {
      if (!izlog.contains(e.relatedTarget)) pokreni();
    });

    /* ne vrti se dok se ne vidi — ni na drugoj kartici pregledača */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stani(); else pokreni();
    });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (ulazi) {
        if (ulazi[0].isIntersecting) pokreni(); else stani();
      }, { threshold: .25 }).observe(izlog);
    } else {
      pokreni();
    }
  })();


  /* ---- Birac vrsta na strani gotovih proizvoda -------------------------
     Katalog se ne otvara odmah: prvo se bira vrsta (šoljice, limenke...),
     pa se tek onda pojave teme i proizvodi. Kad se dođe sa naslovne sa
     ?vrsta=..., birac se preskoči. */
  (function () {
    var birac = $("vrstePicker"), deo = $("katalogDeo");
    if (!birac || !deo) return;
    var uvod = $("vrsteUvod"), nazad = $("nazadVrste"), naslovVrste = $("vrstaIme");

    /* naziv izabrane vrste — uzima se iz same pločice, da ne postoje dva spiska */
    function imeVrste(v) {
      var d = birac.querySelector('.vrsta[data-vrsta="' + v + '"] .vrsta__ime');
      return d ? d.textContent : "";
    }

    function otvori(vrsta, pomeri) {
      birac.hidden = true;
      if (uvod) uvod.hidden = true;
      deo.hidden = false;
      /* filter po vrsti stoji u istim čipovima koje katalog već koristi —
         klikom na čip ide i osvežavanje spiska, bez duplirane logike */
      var cip = document.querySelector('#filterVrsta [data-vrednost="' + vrsta + '"]');
      if (cip) cip.click();
      if (naslovVrste) naslovVrste.textContent = imeVrste(vrsta);
      if (pomeri) deo.scrollIntoView({ block: "start", behavior: mirnije ? "auto" : "smooth" });
    }

    function zatvori() {
      deo.hidden = true;
      birac.hidden = false;
      if (uvod) uvod.hidden = false;
      birac.scrollIntoView({ block: "center", behavior: mirnije ? "auto" : "smooth" });
    }

    Array.prototype.forEach.call(birac.querySelectorAll(".vrsta"), function (d) {
      d.addEventListener("click", function () {
        var v = d.getAttribute("data-vrsta");
        /* Vrsta bez ijednog proizvoda nema čip (katalog ih ne iscrtava), pa se
           za nju strana učita ponovo — tamošnja provera ispiše poštenu poruku
           umesto da pod tim naslovom ostane spisak svih proizvoda. */
        if (!document.querySelector('#filterVrsta [data-vrednost="' + v + '"]')) {
          location.href = location.pathname + "?vrsta=" + v;
          return;
        }
        history.replaceState(null, "", location.pathname + "?vrsta=" + v);
        otvori(v, true);
      });
    });

    if (nazad) {
      nazad.addEventListener("click", function (e) {
        e.preventDefault();
        /* stiglo se preko teme (ikonice na naslovnoj) — tamo su sve teme,
           ne u biraču vrste na ovoj strani, pa "nazad" vodi na naslovnu */
        var dosaoPremaTemi = new URLSearchParams(location.search).get("tema");
        if (dosaoPremaTemi) {
          location.href = "index.html#vrh";
          return;
        }
        history.replaceState(null, "", location.pathname);
        zatvori();
      });
    }

    /* dolazak sa naslovne (ili sa teme u adresi) preskace birac */
    var par = new URLSearchParams(location.search);
    var v = par.get("vrsta");
    if (par.get("tema") || (v && v !== "sve")) otvori(v || "sve", false);
  })();


  /* "Početna" i logo vode na sam vrh strane.
     Sidro #vrh staje ispod lepljive navigacije, pa bi naslovna bila odsečena. */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#vrh"]'), function (veza) {
    veza.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: mirnije ? "auto" : "smooth" });
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    });
  });
})();