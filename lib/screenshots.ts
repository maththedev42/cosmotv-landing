// Localized store screenshots, vendored from the CosmoHQ manifest into
// public/store/<locale>/<device>/<hash>.webp (resized, same pixels).
//
// Each locale uses ONLY its own images. Store frames #3 and #5 are not vendored:
// they show or advertise ratings and private notes, which v1 does not ship.
//
// Default-visible placements (one image per placement):
//   hero      iphone.home  (+ ipad.home from lg)
//   value     iphone.import
//   product   iphone.discover  — the tour reveals the others on demand

import type { Locale } from "./locales";

export type Device = "iphone" | "ipad";
export type ShotKey = "home" | "import" | "discover" | "rewind";

export interface Shot {
  src: string;
  width: number;
  height: number;
  device: Device;
  key: ShotKey;
}

const SIZE: Record<Device, { width: number; height: number }> = {
  iphone: { width: 780, height: 1688 },
  ipad: { width: 1200, height: 1601 },
};

/** Manifest order: #1 home, #2 import, #4 discover, #6 rewind. */
const HASHES: Record<Locale, Record<Device, Record<ShotKey, string>>> = {
  en: {
    iphone: {
      home: "d311d6b363031efb12ae55b70fd358b2aed1b31dcf707ed0e94bf727723071c7",
      import: "eb8b02ab7fec974e1d05af892512b2714fec23f6b429ae0cef7f68d16b973c9e",
      discover: "edfb0e186785581ed2573c996b8b8619992e7681ebd46c457f898c30d3d99340",
      rewind: "c1cbd51d1ba32a7bc39d7ab6383ff776dbb91fb8f786de24da5148e149da02e7",
    },
    ipad: {
      home: "3935a5eb6b6254d7795cc57c41a7d3fdd1430d7c6911c0d653bb4efdf1002711",
      import: "262a19b2f1938c9df9eca8c6eb45bb9c71a70dedcac16841e56dfc4d592e55f0",
      discover: "a3204fc021d80618a6164cfe6fff62227e4d036668e676dfe14083d5485ddcd7",
      rewind: "cd36fac839889a6b7c9821ba0277b3eeea53b7ad1cd41470b2dcf034b140af5b",
    },
  },
  es: {
    iphone: {
      home: "15cea0f555be76daa59d107991ceaccd0de6a6f1df1bc79ae030c774de36e711",
      import: "8cf3f16b774f0f20268f4f609b4ef04f317c0f1e597d025654d9f094432c5c89",
      discover: "2a1e52cdd7f54e75cee49ddeb57e0f6734968c14af769841a58d8aee99f92db5",
      rewind: "bc4d1c2b01b139f547b265c5d9258b98a9b3fa810aa287e1925deb6e4c93d453",
    },
    ipad: {
      home: "110eb111556731085a00fdc0f8aba6da66f53c9b2fb4fcb45fadf2b54d3b0894",
      import: "22edf34266e54799973ce89c0ca60835d820e7565fcf181262676c43f3b0a04c",
      discover: "d6b4243df9935e56aefac46e23cc0819256be60d1bee326bdc4a0ae96dac476a",
      rewind: "1e91628ebb6a8e825632be37d2f6a333f51945fe6038e429c0a40b8bce6e7cab",
    },
  },
  "pt-BR": {
    iphone: {
      home: "518ae386a14667fa713d37871deca7f02c8b4c3c268968b9ac81235737e58fc5",
      import: "96d8534a9bd634a69a7e9592919baeb5f90faee8f3f19e2548fe1881d5833077",
      discover: "33393c5ca2437208ba3595ccc8c4e6cd0f91ef912f2ddd33cc628c48ed196a98",
      rewind: "5d1630e43a95fbffd119409b67b53e2f0bab78bb1d884151205e8704b05d722a",
    },
    ipad: {
      home: "7d81f85c1ae01f09af13e3ccb3810289e90cee111de2a780d29d1aa76c65e873",
      import: "6a5a37abebf163a75f4ca38d8270808d4a372e2665556f6e662d7d7641422bf5",
      discover: "25f18dc2c4db6e551f192b27ee1a33320202c09d013f5e9c7254e27b8c33772b",
      rewind: "c8c5c6eb667ef1535dbe19ee2ff93c18bdcd675f918b0f610f149d98296a9028",
    },
  },
};

export function getShot(locale: Locale, device: Device, key: ShotKey): Shot {
  return {
    src: `/store/${locale}/${device}/${HASHES[locale][device][key]}.webp`,
    ...SIZE[device],
    device,
    key,
  };
}

/** Stories the product tour can switch between, in display order. */
export const TOUR_STORIES = ["discover", "rewind", "import"] as const satisfies readonly ShotKey[];
export type TourStory = (typeof TOUR_STORIES)[number];
