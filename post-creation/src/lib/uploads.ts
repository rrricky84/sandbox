export interface MixcloudUpload {
  // Feed path used to build the Mixcloud widget iframe URL, e.g. "/User/show-slug/".
  feed: string;
  title: string;
  url: string;
  createdAt: string;
}

// Demo profile whose recent uploads we list in the "promote an upload" picker.
export const PROMOTE_PROFILE_USERNAME = "colleencosmomurphy";

export function mixcloudWidgetUrl(feed: string): string {
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(
    feed
  )}`;
}

interface ApiCloudcast {
  key: string;
  name: string;
  url: string;
  created_time: string;
}

interface ApiResponse {
  data: ApiCloudcast[];
}

export async function fetchRecentUploads(
  username: string,
  limit = 10
): Promise<MixcloudUpload[]> {
  const res = await fetch(
    `https://api.mixcloud.com/${encodeURIComponent(
      username
    )}/cloudcasts/?limit=${limit}`
  );
  if (!res.ok) {
    throw new Error(`Mixcloud API returned ${res.status}`);
  }
  const json = (await res.json()) as ApiResponse;
  return json.data.map((c) => ({
    feed: c.key,
    title: c.name,
    url: c.url,
    createdAt: c.created_time,
  }));
}
