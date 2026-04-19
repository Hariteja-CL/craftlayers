# Technical Requirements Checklist: AI Factory Gateway Setup

Give this checklist to your AI assistant (Claude) on the server to ensure the **AI Factory Gateway** is configured correctly.

### 1. Server Environment
- [ ] **OS**: Ubuntu or Debian.
- [ ] **Dependencies**: Install `nginx`, `certbot`, and `python3-certbot-nginx`.
- [ ] **Ports**: Ensure your VPS firewall allows inbound traffic on **Port 80** and **Port 443**.

### 2. Nginx Reverse Proxy Configuration
Create a site configuration (e.g., `/etc/nginx/sites-available/craftlayers-api`) with the following logic:
- [ ] **Proxy Pass**: Forward all traffic to `http://127.0.0.1:8000` (the Agent backend).
- [ ] **CORS Headers (Critical)**: Add dynamic headers to allow specified origins:
    - `http://localhost:5173` (for local development)
    - `https://craftlayers.com` (for production portfolio)
    - `https://*.craftlayers.com` (for subdomains)
- [ ] **Pre-flight Handling**: Return `204` for all `OPTIONS` requests with the correct CORS headers.
- [ ] **Headers**: Forward `Host`, `X-Forwarded-For`, and `Upgrade` (for WebSockets support).

### 3. Cloudflare Tunnel Configuration
- [ ] **Connector**: Install the `cloudflared` daemon on the VPS.
- [ ] **Public Hostname**: Map `factory-service.craftlayers.com` to **`http://localhost:80`** (NOT directly to 8000). 
    - *Rationale: This allows Nginx to handle the CORS headers required for local testing.*

### 4. SSL & Security
- [ ] **SSL Termination**: Use Cloudflare's edge SSL.
- [ ] **Origin Protection**: (Optional) Disable the default Nginx "welcome" page and only respond to the factory domain.

---

### **Prompt to give Claude on the Server:**
> "I need to set up an Nginx reverse proxy on this Ubuntu VPS for my AI Agents running on port 8000. 
> 1. Install Nginx and Certbot.
> 2. Configure a site that proxies traffic from `factory-service.craftlayers.com` to `localhost:8000`.
> 3. **Crucially**, implement dynamic CORS headers to allow `http://localhost:5173` and `https://*.craftlayers.com`. 
> 4. Ensure `OPTIONS` requests are handled correctly with a 204 status.
> 5. Enable the site and reload Nginx."
