import { NextResponse } from "next/server";

export const revalidate = 300;
export const dynamic = "force-dynamic";

type GitHubCommitSearchResult = {
  items?: Array<{
    html_url: string;
    repository: { full_name: string };
    commit: {
      message: string;
      author?: { date?: string };
      committer?: { date?: string };
    };
  }>;
};

export async function GET() {
  const response = await fetch(
    "https://api.github.com/search/commits?q=author:ujjwal-py&sort=author-date&order=desc&per_page=4",
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "ujjwal-portfolio",
      },
      next: { revalidate: 300 },
    },
  );

  if (!response.ok) {
    return NextResponse.json({ commits: [] }, { status: response.status });
  }

  const data: GitHubCommitSearchResult = await response.json();
  const commits = (data.items || []).map((commit) => ({
    repository: commit.repository.full_name.replace("ujjwal-py/", ""),
    message: commit.commit.message.split("\n")[0],
    url: commit.html_url,
    timestamp: commit.commit.author?.date || commit.commit.committer?.date || "",
  }));

  return NextResponse.json({ commits });
}
