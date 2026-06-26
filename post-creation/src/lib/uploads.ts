export interface MixcloudUpload {
  id: string;
  title: string;
  creator: string;
  date: string;
  // Feed path used to build the Mixcloud widget iframe URL, e.g. "/User/show-slug/".
  feed: string;
}

export const UPLOADS: MixcloudUpload[] = [
  {
    id: "bb-22-02-26",
    title: "Balearic Breakfast 22.02.26",
    creator: "Colleen 'Cosmo' Murphy",
    date: "22 Feb 2026",
    feed: "/ColleenCosmoMurphy/balearic-breakfast-189-13042024/",
  },
  {
    id: "bb-15-02-26",
    title: "Balearic Breakfast 15.02.26",
    creator: "Colleen 'Cosmo' Murphy",
    date: "15 Feb 2026",
    feed: "/ColleenCosmoMurphy/balearic-breakfast-188-06042024/",
  },
  {
    id: "bb-08-02-26",
    title: "Balearic Breakfast 08.02.26",
    creator: "Colleen 'Cosmo' Murphy",
    date: "8 Feb 2026",
    feed: "/ColleenCosmoMurphy/balearic-breakfast-187-30032024/",
  },
  {
    id: "bb-01-02-26",
    title: "Balearic Breakfast 01.02.26",
    creator: "Colleen 'Cosmo' Murphy",
    date: "1 Feb 2026",
    feed: "/ColleenCosmoMurphy/balearic-breakfast-186-23032024/",
  },
];

export function getUploadById(id: string | null | undefined): MixcloudUpload | undefined {
  if (!id) return undefined;
  return UPLOADS.find((u) => u.id === id);
}

export function mixcloudWidgetUrl(feed: string): string {
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(
    feed
  )}`;
}
