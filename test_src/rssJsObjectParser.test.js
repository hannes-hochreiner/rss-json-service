import {parseRssJsObject} from '../bld/rssJsObjectParser';
import {default as fs} from 'fs';
import {default as xml2js} from 'xml2js';

describe('parseRssJsObject', () => {
  it('should parse c-radar feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/c-radar.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'C-RadaR',
          description: 'Monatliche Radiosendung des Chaos Computer Clubs auf Radio Darmstadt. Jeden 2ten Donnerstag im Monat, 21-23 Uhr. 103,4 MHz / 99,85 MHz im Kabel / Stream. Tune In!',
          image: {
            title: 'C-RadaR',
            url: 'https://www.c-radar.de/wp-content/uploads/2016/05/cropped-chaosknoten-1-32x32.png'
          },
          items: [
            { date: '2017-09-15T11:00:36.000Z', guid: 'https://www.c-radar.de/?p=354', title: 'c-radar September 2017 – Martin Tschirsich zu PC-Wahl, Piratenspitzenkandidat Sebulino und ein Überraschungsgast', subtitle: 'Aus dem neuen, digitalen und vollbesetzten RadaR Studio haben wir heute viel über die anstehende Bundestagswahl gesprochen. Genauer hatten wir Martin Tschirsich zu Gast, welcher mit dem Chaos Computer Club vor einer Woche Mängel an dem Programm PC-Wahl...', enclosure: { url: 'http://ftp.ccc.de/broadcast/c-radar/c-radar/2017/c-radar-09-2017.mp3', type: 'audio/mpeg' }},
            { date: '2017-07-27T20:39:43.000Z', guid: 'https://www.c-radar.de/?p=322', title: 'c-radar Juli 2017 – zwei Berichte vom G20 in HH; NODE Forum, CCC Regiotreff,  Grundrechte Demo in Berlin', subtitle: 'Diese Sendung hatte einen klaren Schwerpunkt: Die zahlreichen Protestformen um den G20 in HH. Am Telefon hatten wir Kathia (@stephiewunder), welche in Hamburg wohnt und schon seit einem halben Jahr verschiedene friedliche Proteste mit vorbereitet hat,', enclosure: { url: 'http://ftp.ccc.de/broadcast/c-radar/c-radar/2017/c-radar-07-2017.mp3', type: 'audio/mpeg' }},
            { date: '2017-06-12T08:33:35.000Z', guid: 'https://www.c-radar.de/?p=294', title: 'c-radar Juni 2017 – BalCCon, FF Hessentag, Night of Science, SHA2017, Debian Release Party', subtitle: 'Wir haben diesmal wieder alles für Euch gegeben! Wir hatten einige coole Anrufer: milobit vom BalCCon Orga Team stellte uns das Event vor. Dies findet vom 15.-17. September 2017 in Novi Sad, Serbien statt – und dj-spock hat versprochen dort … Weiterles...', enclosure: { url: 'http://ftp.ccc.de/broadcast/c-radar/c-radar/2017/c-radar-06-2017.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse embedded.fm feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/embedded_fm.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'Embedded',
          description: 'Embedded is the show for people who love gadgets. Making them, breaking them, and everything in between. Weekly interviews with engineers, educators, and enthusiasts.',
          image: {
            url: 'http://static1.squarespace.com/static/50834ba9c4aa1a31c651078b/t/575ae364044262ac9d73d8b5/1465574246647/1500w/squarePoster1.jpg'
          },
          items: [
            { date: '2017-10-06T00:27:52.000Z', guid: '50834ba9c4aa1a31c651078b:50834ba9c4aa1a31c651078f:59d6c91df6576e961db11304', title: '218: Neutron Star of Dev Boards', enclosure: { url: 'http://traffic.libsyn.com/makingembeddedsystems/embedded-ep218.mp3', type: 'audio/mpeg' }},
            { date: '2017-09-29T02:01:13.000Z', guid: '50834ba9c4aa1a31c651078b:50834ba9c4aa1a31c651078f:59cac97db078694b33653f42', title: '217: 10000 Pounds of Pressure', enclosure: { url: 'http://traffic.libsyn.com/makingembeddedsystems/embedded-ep217.mp3', type: 'audio/mpeg' }},
            { date: '2017-09-22T00:55:07.000Z', guid: '50834ba9c4aa1a31c651078b:50834ba9c4aa1a31c651078f:59c28d75d55b41ed45ec523e', title: '216: Bavarian Folk Metal', enclosure: { url: 'http://traffic.libsyn.com/makingembeddedsystems/embedded-ep216.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse partially derivate feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/partially.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'Partially Derivative',
          description: 'The data of the world around us, hosted by data science super geeks. For the nerdy and nerd curious.',
          image: {
            title: 'Partially Derivative',
            url: 'http://partiallyderivative.com/assets/img/partiallyd_title.png'
          },
          items: [
            { date: '2017-09-05T00:00:00.000Z', guid: 'https://backtracks.fm/partiallyderivative/pr/15d4c9ea-9286-11e7-8fd1-0e5a4884b288/end_of_an_era.mp3?s=1', title: 'End Of Era', subtitle: 'The last episode of Partially Derivative for now.', enclosure: { url: 'https://backtracks.fm/partiallyderivative/pr/15d4c9ea-9286-11e7-8fd1-0e5a4884b288/end_of_an_era.mp3?s=1', type: 'audio/mpeg' }},
            { date: '2017-08-15T00:00:00.000Z', guid: 'https://backtracks.fm/partiallyderivative/pr/0fac344a-8453-11e7-86c7-0e84392478bc/art-ificial_intelligence.mp3?s=1', title: 'Art-ificial Intelligence', subtitle: 'This week Chris and Vidya discuss how artificial intelligence is affecting the world of artists.', enclosure: { url: 'https://backtracks.fm/partiallyderivative/pr/0fac344a-8453-11e7-86c7-0e84392478bc/art-ificial_intelligence.mp3?s=1', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse ThisDevelopersLife feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/this_devs_life.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'This Developer\'s Life',
          description: 'Stories About Developers and Their Lives',
          image: {
            url: 'http://media.wekeroad.com/tdl2.png'
          },
          items: [
            { date: '2015-06-24T00:00:00.000Z', guid: 'tag:thisdeveloperslife.com,2015-06-24:/post/4-0-1-faith', title: '4.0.1 Faith', subtitle: 'How does our Faith drive us? Do you have Faith in yourself and your abilities, and how do you know you\'re on the right path? Download Here', enclosure: { url: 'http://feedproxy.google.com/~r/ThisDevelopersLife/~5/LaGuKN3kGTM/401-Faith.mp3', type: 'audio/mpeg' }},
            { date: '2013-12-10T00:00:00.000Z', guid: 'tag:thisdeveloperslife.com,2013-12-10:/post/3-0-2-space', title: '3.0.2 Space' }
          ]
        });
      });
    });
  });

  it('should parse spark feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/spark.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'Spark from CBC Radio',
          description: 'Spark on CBC Radio One Nora Young helps you navigate your digital life by connecting you to fresh ideas in surprising ways.',
          image: {
            title: 'Spark from CBC Radio',
            url: 'https://www.cbc.ca/radio/podcasts/images/promo-spark.jpg'
          },
          items: [
            { date: '2017-10-13T04:00:00.000Z', guid: 'https://podcast-a.akamaihd.net/mp3/podcasts/spark_20171015_47655.mp3', title: '367: Loneliness, Algorithms, War and Peace', subtitle: 'The trouble with advertising algorithms. The Loneliness Project. Why you should read War and Peace on your phone.', enclosure: { url: 'https://podcast-a.akamaihd.net/mp3/podcasts/spark_20171015_47655.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse lancet feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/lanonc.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'Listen to The Lancet Oncology',
          description: 'The Lancet Oncology is a monthly journal, renowned for the publication of high-quality peer reviewed research, reviews and analysis in cancer from around the world. In the monthly podcasts, editors of the journal discuss highlights of the current issue.',
          image: {
            title: 'Listen to The Lancet Oncology',
            url: 'http://www.thelancet.com/pb/assets/raw/lancet/podcast/lanonc.jpg'
          },
          items: [
            { date: '2017-11-01T06:30:00.000Z', guid: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_171031_moonshot.mp3', title: 'Future cancer research priorities in the USA: The Lancet Oncology Commission: October 31, 2017', subtitle: '<p>Commission co-chairs Chi Van Dang and Elizabeth M. Jaffee discuss a new <em>Lancet Oncology</em> Commission on cancer treatment and care in the USA.</p>', enclosure: { url: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_171031_moonshot.mp3', type: 'audio/mpeg' }},
            { date: '2017-09-28T14:30:00.000Z', guid: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_170927_peru.mp3', title: 'Cancer in Peru: The Lancet Oncology', subtitle: '<p>Ben Anderson talks about cancer care and cancer trends in Peru.</p>', enclosure: { url: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_170927_peru.mp3', type: 'audio/mpeg' }},
            { date: '1970-01-01T00:00:00.000Z', guid: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_170726_indels.mp3', title: 'Indel derived tumour-specific neoantigens: The Lancet Oncology: Aug 2017', subtitle: '<p>Samra Turajlic discusses the contribution of small insertions and deletions to&nbsp;tumour-specific antigen analyses.</p>', enclosure: { url: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_170726_indels.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse francais facil feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/francais_facil.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'RFI - Journal en français facile 20H TU',
          description: 'Un journal qui présente l\'actualité avec des mots simples et explique les évènements et leur contexte pour rendre l\'information en français accessible à tous.',
          image: {
            title: 'RFI - Journal en français facile 20H TU',
            url: 'http://www.rfi.fr/images/rfi_web.jpg'
          },
          items: [
            { date: '2017-11-29T20:00:00.000Z', guid: '1_D142_1568839', title: 'Journal en français facile du 29/11/2017  - 20h00 TU', enclosure: { url: 'http://telechargement.rfi.fr/rfi/francais/audio/jff/201711/journal_francais_facile_20h00_-_20h10_tu_20171129.mp3', type: 'audio/mpeg' }},
          ]
        });
      });
    });
  });

  it('should parse command line hero feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/clh.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'Command Line Heroes',
          description: 'Stories about the people transforming technology from the command line up.',
          image: {
            title: 'Command Line Heroes',
            url: 'https://media.simplecast.com/podcast/image/3909/1512098978-artwork.jpg'
          },
          items: [
            { date: '2018-01-16T06:01:00.000Z', guid: '36fda030-1e17-4f0c-8c74-8dae35e95daa', title: 'OS Wars_part 1', subtitle: 'The O.S. Wars. The 1980s is a period of mounting tensions. The empires of Bill Gates and Steve Jobs careen toward an inevitable battle over proprietary software—only one empire can emerge as the purveyor of a standard operating system for millions of user', enclosure: { url: 'https://tracking.feedpress.it/link/18442/8049593/f7670e99.mp3', type: 'audio/mpeg' }},
            { date: '2018-01-16T06:00:00.000Z', guid: '0e52b0be-4c91-48fe-b8a2-cfad32df28b8', title: 'OS Wars_part 2: Rise of Linux', subtitle: 'It\'s the 1990s. The empire of Microsoft controls 90% of users. Complete standardization of operating systems seems assured. But an unlikely hero arises from amongst the band of open source rebels. Linus Torvalds—meek, bespectacled—releases his Linux O.S.', enclosure: { url: 'https://tracking.feedpress.it/link/18442/8049594/2199861a.mp3', type: 'audio/mpeg' }},
            { date: '2017-12-01T14:00:00.000Z', guid: '2945a8ce-3d3e-47d5-b45b-2bcb7c0c73c9', title: 'Preview_CLH', subtitle: 'Introducing a show about the developers, programmers, hackers, geeks, and open source rebels who are shaping our digital future.', enclosure: { url: 'https://tracking.feedpress.it/link/18442/7582651/3def9db9.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse bots feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/bots.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'O\'Reilly Bots Podcast - O\'Reilly Media Podcast',
          description: 'Exploring bots, conversational interfaces, AI, and messaging.',
          image: {
            title: 'O\'Reilly Bots Podcast - O\'Reilly Media Podcast',
            url: 'http://cdn.oreilly.com/radar/bot-podcast/avatar_Bots_1400x1400.png'
          },
          items: [
            { date: '2017-05-25T10:30:00.000Z', guid: 'https://www.oreilly.com/ideas/jason-laska-and-michael-akilian-on-scheduling-bots', title: 'Jason Laska and Michael Akilian on using AI to schedule meetings', enclosure: { url: 'http://dts.podtrac.com/redirect.mp3/cdn.oreillystatic.com/radar/bot-podcast/Jason_Laska_and_Michael_Akilian_on_scheduling_bots.mp3', type: 'audio/mpeg' }},
            { date: '2017-05-11T10:45:00.000Z', guid: 'https://www.oreilly.com/ideas/chris-messina-on-facebook-as-a-utility', title: 'Chris Messina on Facebook as a utility', enclosure: { url: 'http://dts.podtrac.com/redirect.mp3/cdn.oreillystatic.com/radar/bot-podcast/Chris_Messina_on_Facebook_as_a_utility.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse linear digressions feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/lin_digres.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'Linear Digressions',
          description: 'search for me',
          items: [
            { date: '2018-03-12T01:46:48.000Z', guid: '56c89b14c2ea51c475ee830b:56c89d67cf80a13fe9f812d7:5aa5db15f9619ae04bf186f3', title: 'Autoencoders', enclosure: { url: 'http://static1.squarespace.com/static/56c89b14c2ea51c475ee830b/t/5aa5dbc6c8302542e9d31410/1520819158384/autoencoders+produced.mp3', type: 'audio/mpeg' }},
            { date: '2018-03-05T03:34:55.000Z', guid: '56c89b14c2ea51c475ee830b:56c89d67cf80a13fe9f812d7:5a931fe3e2c483bcb2a998f1', title: 'When is open data too open?', enclosure: { url: 'http://static1.squarespace.com/static/56c89b14c2ea51c475ee830b/t/5a9cba3dc830255b24811f2b/1520220754818/data+privacy+produced.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse spark gap feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/sparkgap.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'The Spark Gap',
          description: 'Karl and Corey talk about various aspects of embedded electronics.',
          image: {
            title: 'The Spark Gap',
            url: 'https://ssl-static.libsyn.com/p/assets/4/0/e/8/40e82aebe44f8431/The_Spark_Gap.png'
          },
          items: [
            { date: '2018-01-31T21:00:00.000Z', guid: 'c83486efd804816252a8fcf167e630cf', title: 'The Spark Gap - Episode 53', subtitle: 'Project updates - Part 1', enclosure: { url: 'https://traffic.libsyn.com/secure/thesparkgap/Podcast53.mp3?dest-id=205185', type: 'audio/mpeg' }},
            { date: '2018-01-01T18:00:00.000Z', guid: '4cd2a2c8b62734d5a2c2fa35d924a8dd', title: 'The Spark Gap - Episode 52', subtitle: 'Working with Dev Kits', enclosure: { url: 'https://traffic.libsyn.com/secure/thesparkgap/Podcast52.mp3?dest-id=205185', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should fail gracefully if there are no items', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/empty.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'C-RadaR',
          description: 'Monatliche Radiosendung des Chaos Computer Clubs auf Radio Darmstadt. Jeden 2ten Donnerstag im Monat, 21-23 Uhr. 103,4 MHz / 99,85 MHz im Kabel / Stream. Tune In!',
          items: []
        });
      });
    });
  });
});
