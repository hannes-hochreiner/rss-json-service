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
          items: [
            { date: '2017-09-15T11:00:36.000Z', guid: 'https://www.c-radar.de/?p=354', title: 'c-radar September 2017 – Martin Tschirsich zu PC-Wahl, Piratenspitzenkandidat Sebulino und ein Überraschungsgast', enclosure: { url: 'http://ftp.ccc.de/broadcast/c-radar/c-radar/2017/c-radar-09-2017.mp3', type: 'audio/mpeg' }},
            { date: '2017-07-27T20:39:43.000Z', guid: 'https://www.c-radar.de/?p=322', title: 'c-radar Juli 2017 – zwei Berichte vom G20 in HH; NODE Forum, CCC Regiotreff,  Grundrechte Demo in Berlin', enclosure: { url: 'http://ftp.ccc.de/broadcast/c-radar/c-radar/2017/c-radar-07-2017.mp3', type: 'audio/mpeg' }},
            { date: '2017-06-12T08:33:35.000Z', guid: 'https://www.c-radar.de/?p=294', title: 'c-radar Juni 2017 – BalCCon, FF Hessentag, Night of Science, SHA2017, Debian Release Party', enclosure: { url: 'http://ftp.ccc.de/broadcast/c-radar/c-radar/2017/c-radar-06-2017.mp3', type: 'audio/mpeg' }}
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
          items: [
            { date: '2017-10-06T00:27:52.000Z', guid: '50834ba9c4aa1a31c651078b:50834ba9c4aa1a31c651078f:59d6c91df6576e961db11304', title: '218: Neutron Star of Dev Boards', enclosure: { url: 'http://traffic.libsyn.com/makingembeddedsystems/embedded-ep218.mp3', type: 'audio/mpeg' }},
            { date: '2017-09-29T02:01:13.000Z', guid: '50834ba9c4aa1a31c651078b:50834ba9c4aa1a31c651078f:59cac97db078694b33653f42', title: '217: 10000 Pounds of Pressure', enclosure: { url: 'http://traffic.libsyn.com/makingembeddedsystems/embedded-ep217.mp3', type: 'audio/mpeg' }},
            { date: '2017-09-22T00:55:07.000Z', guid: '50834ba9c4aa1a31c651078b:50834ba9c4aa1a31c651078f:59c28d75d55b41ed45ec523e', title: '216: Bavarian Folk Metal', enclosure: { url: 'http://traffic.libsyn.com/makingembeddedsystems/embedded-ep216.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });

  it('should parse embedded.fm feeds', () => {
    let parser = new xml2js.Parser();

    fs.readFile('testFiles/partially.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        expect(parseRssJsObject(result)).toEqual({
          title: 'Partially Derivative',
          description: 'The data of the world around us, hosted by data science super geeks. For the nerdy and nerd curious.',
          items: [
            { date: '2017-09-05T00:00:00.000Z', guid: 'https://backtracks.fm/partiallyderivative/pr/15d4c9ea-9286-11e7-8fd1-0e5a4884b288/end_of_an_era.mp3?s=1', title: 'End Of Era', enclosure: { url: 'https://backtracks.fm/partiallyderivative/pr/15d4c9ea-9286-11e7-8fd1-0e5a4884b288/end_of_an_era.mp3?s=1', type: 'audio/mpeg' }},
            { date: '2017-08-15T00:00:00.000Z', guid: 'https://backtracks.fm/partiallyderivative/pr/0fac344a-8453-11e7-86c7-0e84392478bc/art-ificial_intelligence.mp3?s=1', title: 'Art-ificial Intelligence', enclosure: { url: 'https://backtracks.fm/partiallyderivative/pr/0fac344a-8453-11e7-86c7-0e84392478bc/art-ificial_intelligence.mp3?s=1', type: 'audio/mpeg' }}
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
          items: [
            { date: '2015-06-24T00:00:00.000Z', guid: 'tag:thisdeveloperslife.com,2015-06-24:/post/4-0-1-faith', title: '4.0.1 Faith', enclosure: { url: 'http://feedproxy.google.com/~r/ThisDevelopersLife/~5/LaGuKN3kGTM/401-Faith.mp3', type: 'audio/mpeg' }},
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
          items: [
            { date: '2017-10-13T04:00:00.000Z', guid: 'https://podcast-a.akamaihd.net/mp3/podcasts/spark_20171015_47655.mp3', title: '367: Loneliness, Algorithms, War and Peace', enclosure: { url: 'https://podcast-a.akamaihd.net/mp3/podcasts/spark_20171015_47655.mp3', type: 'audio/mpeg' }}
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
          items: [
            { date: '2017-11-01T06:30:00.000Z', guid: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_171031_moonshot.mp3', title: 'Future cancer research priorities in the USA: The Lancet Oncology Commission: October 31, 2017', enclosure: { url: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_171031_moonshot.mp3', type: 'audio/mpeg' }},
            { date: '2017-09-28T14:30:00.000Z', guid: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_170927_peru.mp3', title: 'Cancer in Peru: The Lancet Oncology', enclosure: { url: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_170927_peru.mp3', type: 'audio/mpeg' }},
            { date: '1970-01-01T00:00:00.000Z', guid: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_170726_indels.mp3', title: 'Indel derived tumour-specific neoantigens: The Lancet Oncology: Aug 2017', enclosure: { url: 'http://www.thelancet.com/pb-assets/Lancet/stories/audio/lanonc/2017/lanonc_170726_indels.mp3', type: 'audio/mpeg' }}
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
          items: [
            { date: '2018-01-16T06:01:00.000Z', guid: '36fda030-1e17-4f0c-8c74-8dae35e95daa', title: 'OS Wars_part 1', enclosure: { url: 'https://tracking.feedpress.it/link/18442/8049593/f7670e99.mp3', type: 'audio/mpeg' }},
            { date: '2018-01-16T06:00:00.000Z', guid: '0e52b0be-4c91-48fe-b8a2-cfad32df28b8', title: 'OS Wars_part 2: Rise of Linux', enclosure: { url: 'https://tracking.feedpress.it/link/18442/8049594/2199861a.mp3', type: 'audio/mpeg' }},
            { date: '2017-12-01T14:00:00.000Z', guid: '2945a8ce-3d3e-47d5-b45b-2bcb7c0c73c9', title: 'Preview_CLH', enclosure: { url: 'https://tracking.feedpress.it/link/18442/7582651/3def9db9.mp3', type: 'audio/mpeg' }}
          ]
        });
      });
    });
  });
});
