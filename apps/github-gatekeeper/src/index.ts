// simplified gatekeeper probot app
import { Probot, Context } from "probot";
import fetch from "node-fetch";

const ASSESS_ENDPOINT = process.env.ASSESS_ENDPOINT || "http://assessment-api:8080/assess";

function aiChange(filename: string): boolean {
  return filename.startsWith("ai_model/") || filename.endsWith(".model.yaml");
}

export = (app: Probot) => {
  app.on(["pull_request.opened", "pull_request.synchronize"], async (context: Context<"pull_request">) => {
    const pr = context.payload.pull_request;
    const repo = context.repo();
    const compare = await context.octokit.repos.compareCommitsWithBasehead({
      owner: repo.owner,
      repo: repo.repo,
      basehead: `${pr.base.sha}...${pr.head.sha}`
    });
    const changed = (compare.data.files || []).some(f => aiChange(f.filename));
    if (!changed) return;

    const check = await context.octokit.checks.create({
      owner: repo.owner, repo: repo.repo,
      name: "AI-Act Re-Assessment", head_sha: pr.head.sha, status: "queued"
    });

    try {
      const res = await fetch(ASSESS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: `${repo.owner}/${repo.repo}`, sha: pr.head.sha, pr_number: pr.number })
      });
      const { score } = await res.json();
      const conclusion = score === "pass" ? "success" : "failure";
      await context.octokit.checks.update({
        owner: repo.owner, repo: repo.repo, check_run_id: check.data.id,
        completed_at: new Date().toISOString(), conclusion,
        output: { title: "AI Act Assessment", summary: `Assessment ${score}` }
      });
    } catch (e) {
      context.log.error(e);
    }
  });
};
