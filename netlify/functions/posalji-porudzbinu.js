// Netlify funkcija: prima porudžbinu sa sajta (fetch iz assets/site.js) i
// šalje dva mejla preko Resend-a — kupcu potvrdu, vlasniku radionice sve
// podatke za pripremu paketa. Domen bedzic.com je verifikovan na Resend-u,
// RESEND_API_KEY dolazi iz Netlify Environment Variables.
const { Resend } = require("resend");

// Mora da odgovara EMAIL_PORUDZBINE iz assets/site.js — tu i dalje stižu
// i porudžbine koje idu starim putem (FormSubmit), ako se ikad koristi.
const EMAIL_VLASNIKA = "bedzic5@gmail.com";
const POSILJALAC = "Bedžić <porudzbine@bedzic.com>";

// Ukupna veličina priloga u jednom pozivu — Netlify funkcije (sinhrone)
// odbijaju telo preko ~6 MB, a base64 enkodiranje naduva fajlove za ~37%.
// 3 MB sirovih bajtova je bezbedna granica.
const MAKS_PRILOZI_BAJTOVA = 3 * 1024 * 1024;

function ocisti(tekst) {
  return String(tekst || "").trim();
}

function validnaAdresa(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Pretvara "\n" u <br> i bezbedno eskejpuje HTML — tekst porudžbine je
// već čist, običan tekst sastavljen u site.js.
function uHtml(tekst) {
  return String(tekst || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function emailOmot(naslov, telo) {
  return (
    '<div style="font-family:Arial,sans-serif;background:#FFF6F8;padding:28px 16px">' +
    '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #F3DCE4">' +
    '<div style="background:#CE3A31;color:#fff;padding:18px 24px;font-size:20px;font-weight:800">Bedžić</div>' +
    '<div style="padding:24px;color:#463141;font-size:15px;line-height:1.6">' +
    "<h2 style=\"margin:0 0 14px;color:#B02A22;font-size:18px\">" + naslov + "</h2>" +
    telo +
    "</div></div></div>"
  );
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Samo POST." }) };
  }

  var podaci;
  try {
    podaci = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Neispravan zahtev." }) };
  }

  var ime = ocisti(podaci.ime);
  var telefon = ocisti(podaci.telefon);
  var email = ocisti(podaci.email);
  var naslov = ocisti(podaci.naslov) || "Nova porudžbina — Bedžić";
  var tekst = ocisti(podaci.tekst);
  var prilozi = Array.isArray(podaci.prilozi) ? podaci.prilozi : [];

  if (!ime || !telefon || !email || !tekst) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Nedostaju obavezni podaci." }) };
  }
  if (!validnaAdresa(email)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Email adresa nije ispravna." }) };
  }

  // prilozi stižu kao base64 (bez "data:...;base64," prefiksa) — biramo
  // koliko staje u budžet, prednost imaju slike za štampu (bez njih se ne
  // može štampati), pa fotografije proizvoda.
  var sortirani = prilozi.slice().sort(function (a, b) {
    var aPrvi = /štampu/i.test(a.naziv || "") ? 0 : 1;
    var bPrvi = /štampu/i.test(b.naziv || "") ? 0 : 1;
    return aPrvi - bPrvi;
  });
  var zbirBajtova = 0, izostavljeno = 0, zaSlanje = [];
  sortirani.forEach(function (p) {
    if (!p || !p.podaci) return;
    var bajtova = Math.ceil((p.podaci.length * 3) / 4);
    if (zbirBajtova + bajtova > MAKS_PRILOZI_BAJTOVA) { izostavljeno++; return; }
    zbirBajtova += bajtova;
    zaSlanje.push(p);
  });

  var resendAttachments = zaSlanje.map(function (p) {
    return { filename: p.ime || "slika.jpg", content: Buffer.from(p.podaci, "base64") };
  });

  var tekstZaMejl = tekst;
  if (izostavljeno) {
    tekstZaMejl += "\n\n(" + izostavljeno + " fotografije nisu stale u prilog zbog veličine — nalaze se u porudžbini kao linkovi.)";
  }

  var resend = new Resend(process.env.RESEND_API_KEY);

  var mejlKupcu = {
    from: POSILJALAC,
    to: email,
    reply_to: EMAIL_VLASNIKA,
    subject: "Primili smo tvoju porudžbinu — Bedžić",
    html: emailOmot(
      "Hvala na porudžbini, " + ime + "! 🍒",
      "<p>Stigla nam je tvoja porudžbina i javljamo se uskoro da potvrdimo detalje.</p>" +
      '<div style="background:#FFF0F5;border-radius:14px;padding:16px 18px;margin:16px 0;font-family:monospace;font-size:13.5px;white-space:pre-wrap">' +
      uHtml(tekstZaMejl) +
      "</div>" +
      "<p>Ako nešto treba da ispraviš, samo odgovori na ovaj mejl.</p>" +
      "<p>Hvala na poverenju — Bedžić 💌</p>"
    )
  };

  var mejlVlasniku = {
    from: POSILJALAC,
    to: EMAIL_VLASNIKA,
    reply_to: email,
    subject: naslov,
    html: emailOmot(
      "Nova porudžbina",
      '<p><b>Kupac:</b> ' + uHtml(ime) + '<br>' +
      '<b>Telefon:</b> ' + uHtml(telefon) + '<br>' +
      '<b>Email:</b> ' + uHtml(email) + "</p>" +
      '<div style="background:#FFF0F5;border-radius:14px;padding:16px 18px;margin:16px 0;font-family:monospace;font-size:13.5px;white-space:pre-wrap">' +
      uHtml(tekstZaMejl) +
      "</div>"
    ),
    attachments: resendAttachments.length ? resendAttachments : undefined
  };

  try {
    var rezultati = await Promise.all([
      resend.emails.send(mejlKupcu),
      resend.emails.send(mejlVlasniku)
    ]);
    var greska = rezultati.find(function (r) { return r && r.error; });
    if (greska) {
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: "Resend: " + greska.error.message }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String((e && e.message) || e) }) };
  }
};
