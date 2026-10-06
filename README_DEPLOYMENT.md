# 🚀 Agent 47 Platform - Complete VPS & Domain Setup Guide (A to Z)

## 📌 Overview
This project is a high-performance, modern, bespoke web application with a Stealth Admin CMS and a Tri-Bot Gemini AI Ecosystem. It requires zero Node.js/Python server build steps in production and runs directly on Nginx with ultra-fast loading speed and military-grade styling.

---

## 🌐 STEP 1: Domain DNS Setup (ডোমেইন সেটআপ)

1. লগইন করুন আপনার ডোমেইন প্রোভাইডারে (Namecheap, Cloudflare, GoDaddy, Hostinger, etc.)।
2. **DNS Management / DNS Records** ট্যাবে যান।
3. নিচের ২টি **A Record** যোগ করুন:

| Type | Name / Host | Value / Target | TTL |
|------|-------------|----------------|-----|
| **A** | `@` | `YOUR_VPS_PUBLIC_IP` (যেমন: 123.45.67.89) | Automatic / 1 min |
| **A** | `www` | `YOUR_VPS_PUBLIC_IP` (যেমন: 123.45.67.89) | Automatic / 1 min |

*(DNS আপডেট হতে ২ থেকে ১৫ মিনিট সময় লাগতে পারে)*

---

## 💻 STEP 2: VPS-এ ফাইল আপলোড করা (Upload to VPS)

আপনার জন্য ইতিমধ্যে সম্পূর্ণ প্রোজেক্টের একটি লাইটওয়েট প্রোডাকশন জিপ তৈরি করা আছে:
📁 **`agent47_deploy.zip`** *(মাত্র ~93 KB, আপলোড হতে ১ সেকেন্ড লাগে)*

আপনার কাছে ৩টি সহজ উপায় আছে:

### উপায় ১: SCP Command (টার্মিনাল থেকে এক ক্লিকে সুপারফাস্ট আপলোড - সবচেয়ে সহজ)
আপনার কম্পিউটারের PowerShell বা CMD থেকে এই একটি কমান্ড দিন (YOUR_VPS_IP এর জায়গায় আপনার VPS এর আইপি বসান):
```powershell
scp "d:\Checker\agent47_project\agent47_deploy.zip" root@YOUR_VPS_IP:/root/
```

### উপায় ২: FileZilla বা WinSCP (GUI ড্র্যাগ অ্যান্ড ড্রপ)
1. **FileZilla** ওপেন করুন।
2. Host: `sftp://YOUR_VPS_IP`, Username: `root`, Port: `22`, Password দিন।
3. কানেক্ট হয়ে গেলে `d:\Checker\agent47_project\agent47_deploy.zip` ফাইলটি VPS-এর `/root/` বা `/var/www/` তে টেনে এনে ছেড়ে দিন।

### উপায় ৩: Git Clone (যদি GitHub রিপোসিটোরি ব্যবহার করেন)
```bash
ssh root@YOUR_VPS_IP
cd /var/www
git clone <your-repo-url> agent47
cd agent47
```

---

## ⚡ STEP 3: এক ক্লিকে Nginx ও সার্ভার সেটআপ (Automated Script)

VPS-এ SSH দিয়ে লগইন করুন:
```bash
ssh root@YOUR_VPS_IP
```

যদি `agent47_deploy.zip` আপলোড করে থাকেন, নিচের ৩টি লাইন পেস্ট করুন:
```bash
mkdir -p /var/www/agent47
unzip -o /root/agent47_deploy.zip -d /var/www/agent47 || unzip -o agent47_deploy.zip -d /var/www/agent47
cd /var/www/agent47
sudo bash deploy.sh
```

স্ক্রিপ্টটি স্বয়ংক্রিয়ভাবে:
1. উবুন্টু/ডেবিয়ান প্যাকেজ আপডেট করবে।
2. পোর্ট ৮০ তে কোনো কনফ্লিক্ট (যেমন অ্যাপাচি) থাকলে তা বন্ধ করবে।
3. Nginx ও Certbot ইনস্টল ও কনফিগার করবে।
4. Gzip কম্প্রেশন ও সিকিউরিটি হেডার যুক্ত করবে।
5. UFW ফায়ারওয়ালে পোর্ট ৮০ এবং ৪৪৩ ওপেন করবে।
6. আপনার সাইটকে সাথে সাথে ইন্টারনেটে লাইভ করে দেবে!

---

## 🔒 STEP 4: ফ্রি SSL সার্টিফিকেট সেটআপ (Free Let's Encrypt HTTPS)

আপনার ডোমেইনে ফ্রি প্যাডলক (Green Lock / HTTPS) সেট করতে VPS টার্মিনালে নিচের কমান্ডটি রান করুন:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

- আপনার ইমেইল চাইবে (একটি ভ্যালিড ইমেইল দিন)।
- Terms of Service এগ্রি করতে `Y` দিন।
- রিডাইরেক্ট অপশনে `2` (Redirect HTTP to HTTPS) সিলেক্ট করুন।

🎉 **ব্যাস! আপনার সাইট এখন বিশ্বমানের HTTPS সিকিউরিটি সহ সম্পূর্ণ লাইভ!**

---

## 🕵️‍♂️ Admin Studio Access (অ্যাডমিন প্যানেলে ঢোকার নিয়ম)

1. ব্রাউজারে যান: `https://yourdomain.com/admin` অথবা `https://yourdomain.com/admin.html`
2. কীবোর্ড শর্টকাট: মূল সাইটে থাকা অবস্থায় `Ctrl + Shift + A` চাপলে সরাসরি অ্যাডমিন প্যানেল খুলবে।
3. ডিফল্ট পিন: **`1234`** (লগইন করে Settings থেকে পরিবর্তন করা যাবে)।

---

## 🤖 Tri-Bot Gemini AI Ecosystem Setup
Admin Studio-তে ঢুকে **Gemini & Security** ট্যাবে গিয়ে আপনার ৩টি বট কনফিগার করুন:
1. **Bot 1 (BioBot Persona)**: ভিজিটরদের কাছে আপনার প্রতিনিধি হিসেবে কথা বলবে।
2. **Bot 2 (Omni AI + Voice)**: পাবলিক ভিজিটরদের সাধারণ টেক ও ক্যারিয়ার প্রশ্নের উত্তর দেবে (ভয়েস ইনপুট ও আউটপুট সহ)।
3. **Bot 3 (Master Copilot)**: শুধুমাত্র অ্যাডমিন প্যানেলে আপনার ব্যক্তিগত এক্সিকিউটিভ অ্যাসিস্ট্যান্ট হিসেবে কাজ করবে।

---

## 🐳 বিকল্প উপায়: Docker দিয়ে রান করা (Optional)
যদি আপনার VPS-এ Docker থাকে:
```bash
docker compose up -d --build
```
এক ক্লিকেই পোর্ট ৮০ তে পুরো সাইট ও পারসিস্টেন্ট SQLite ডাটাবেস ভলিউম চালু হয়ে যাবে!

---

## 💾 SQLite Database Management (ডাটাবেস কমান্ড ও ম্যানেজমেন্ট)

প্রোজেক্টটিতে এখন রয়েছে হাই-পারফরম্যান্স **SQLite 3** ডাটাবেস (`database/agent47.db`)।

### ১. লোকাল কম্পিউটারে রান করার নিয়ম:
```powershell
python server.py
```
- ব্রাউজারে ওপেন করুন: `http://localhost:8000` (পোর্টফোলিও)
- অ্যাডমিন স্টুডিও: `http://localhost:8000/admin.html`
- লাইভ এপিআই ডকস: `http://localhost:8000/docs`

### ২. CLI দিয়ে ডাটাবেস চেক ও ব্যাকআপ নেওয়া (`db_manager.py`):
```powershell
# ডাটাবেসের লাইভ হেলথ ও মেসেজ সংখ্যা দেখা:
python db_manager.py status

# ডাটাবেসের টাইমস্ট্যাম্পড ব্যাকআপ তৈরি করা:
python db_manager.py backup

# অ্যাডমিন পিন সরাসরি ডাটাবেসে রিসেট করা:
python db_manager.py reset-pin 1234

# ডাটাবেস JSON এক্সপোর্ট করা:
python db_manager.py export
```

