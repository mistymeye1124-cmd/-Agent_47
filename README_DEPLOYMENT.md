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

আপনার কাছে ৩টি সহজ উপায় আছে:

### উপায় ১: FileZilla বা WinSCP (সবচেয়ে সহজ - GUI)
1. **FileZilla** ওপেন করুন।
2. Host: `sftp://YOUR_VPS_IP`
3. Username: `root` (বা আপনার ইউজারনেম)
4. Password: আপনার VPS পাসওয়ার্ড, Port: `22`
5. Connect হয়ে গেলে বাম পাশ থেকে আপনার প্রোজেক্টের সব ফাইল সিলেক্ট করে VPS-এর `/var/www/agent47` ফোল্ডারে টেনে এনে ড্রপ করুন।

### উপায় ২: Git Clone (GitHub / GitLab)
যদি আপনার গিটহাব রিপো থাকে:
```bash
ssh root@YOUR_VPS_IP
cd /var/www
git clone <your-repo-url> agent47
cd agent47
```

### উপায় ৩: SCP Command (টার্মিনাল থেকে এক ক্লিকে আপলোড)
আপনার কম্পিউটারের PowerShell বা Terminal থেকে:
```bash
scp -r "d:/Checker/test" root@YOUR_VPS_IP:/var/www/agent47
```

---

## ⚡ STEP 3: এক ক্লিকে Nginx ও সার্ভার সেটআপ (Automated Script)

VPS-এ SSH দিয়ে লগইন করুন:
```bash
ssh root@YOUR_VPS_IP
cd /var/www/agent47
chmod +x deploy.sh
bash deploy.sh
```
স্ক্রিপ্টটি স্বয়ংক্রিয়ভাবে Nginx ইনস্টল করবে, ক্যাশিং ও সিকিউরিটি হেডার সেট করবে এবং সাইট লাইভ করে দেবে!

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
এক ক্লিকেই পোর্ট ৮০ তে পুরো সাইট চালু হয়ে যাবে!
