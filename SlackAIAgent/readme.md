# 🤖 Slack New Member AI Lead Research Agent

An automated AI agent built with **Node.js**, **PostgreSQL**, **Slack Web API**, and **OpenRouter** that automatically researches new Slack workspace/channel members, evaluates their customer fit for your product, saves the report to a database, and posts an actionable summary to a private Slack channel.

---

## ✨ Features

- **Real-Time Member Detection:** Automatically listens for new members joining your Slack team or specific channels.
- **Automated Profile & Company Research:** Gathers basic background details on the member's personal and company profile.
- **AI Customer Fit Analysis:** Uses LLMs via the OpenRouter API to evaluate how well the new member matches your Ideal Customer Profile (ICP), generating a **Fit Score**, **Key Insights**, and **Actionable Recommendations**.
- **Rich Slack Notifications:** Formats and posts clean Block Kit summaries directly to a designated private Slack channel.
- **Persistent Storage:** Stores member details and historical AI analyses in **PostgreSQL** to prevent duplicate processing and maintain lead records.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Database:** PostgreSQL
- **AI / LLM Gateway:** OpenRouter API (OpenAI-compatible SDK)
- **Messaging & Events:** Slack Web API (`@slack/web-api`) & Slack Events API

---

## 📋 Prerequisites

Before running this project, make sure you have:
- [Node.js](https://nodejs.org) (v18+ recommended)
- [PostgreSQL](https://postgresql.org) installed and running locally or via a cloud provider
- A Slack workspace with permissions to install apps
- An OpenRouter account for AI model access

---

## 🔑 API Keys & App Setup

### 1. Get an OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai) and sign in or create an account.
2. Navigate to **Keys** in your account dashboard ([openrouter.ai/keys](https://openrouter.aikeys)).
3. Click **Create Key**, give it a name (e.g., `slack-lead-agent`), and copy the generated key (`sk-or-v1-...`).
4. *(Optional)* To test for free without billing, use `openrouter/free` or any model ending in `:free` as your model ID.

---

### 2. Create & Configure the Slack App

1. Go to the [Slack API Dashboard](https://slack.com) and click **Create New App** → **From scratch**.
2. Enter an **App Name** (e.g., `Lead Research Agent`), select your workspace, and click **Create App**.

#### Add Bot Token Scopes
1. In the left sidebar, navigate to **OAuth & Permissions**.
2. Scroll down to **Scopes** → **Bot Token Scopes** and add the following scopes:
   - `chat:write` — Allows the bot to post messages in channels it is invited to.
   - `channels:read` — Allows the bot to view basic info about public channels.
   - `groups:read` — Allows the bot to view basic info about private channels.
   - `users:read` — Allows the bot to fetch profile details of new members.
   - `users:read.email` *(optional)* — Allows the bot to read the user's email address for company domain lookup.

#### Install App & Generate Bot Token
1. Scroll back to the top of **OAuth & Permissions** and click **Install to Workspace**.
2. Review the permissions and click **Allow**.
3. Copy the **Bot User OAuth Token** (starts with `xoxb-...`).

#### Enable Event Subscriptions (Detect New Members)
1. In the left sidebar, go to **Event Subscriptions** and toggle **Enable Events** to **On**.
2. Enter your server's public request URL (e.g., `https://your-domain.com` or an `ngrok` URL for local development).
3. Under **Subscribe to bot events**, add:
   - `team_join` — Triggers when a new member joins the Slack workspace.
   - `member_joined_channel` — Triggers when a member joins a channel.
4. Click **Save Changes** (reinstall the app if prompted).

#### Invite Bot to Your Private Notification Channel
1. Open Slack and go to the **private channel** where you want AI reports posted.
2. Type `/invite @YourBotName` and press **Enter** *(required so the bot can post to the private channel without `not_in_channel` errors)*.
3. Right-click the channel name → **View channel details** and copy the **Channel ID** at the bottom (starts with `C` or `G`).

---

## ⚙️ Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prasilla487/AI_Agents.git
   cd AI_Agents/SlackAIAgent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   # Server
   PORT=3000

   # PostgreSQL
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name

   # OpenRouter AI
   OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
   OPENROUTER_MODEL=openrouter/free

   # Slack
   SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
   SLACK_SIGNING_SECRET=your-slack-signing-secret
   SLACK_REPORT_CHANNEL_ID=C0123456789
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📊 Sample Slack Output

When a new member joins, the agent posts a formatted Block Kit message to your private channel:

> **New Member: John Doe**
> **Company:** Acme Corp | **Fit Score:** 85/100
>
> **Insights:**
> ▎ Leads a 20-person engineering team scaling cloud infrastructure.
> ▎ Recently posted about automating internal developer workflows.
>
> **Recommendations:**
> ▎ Reach out with a personalized onboarding message highlighting workflow automation.
> ▎ Share the enterprise case study relevant to SaaS engineering teams.

---

## 📄 License

This project is licensed under the MIT License.
